import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const runlighterRoot = path.resolve(scriptRoot, '../..');
const launchpadSource = path.resolve(runlighterRoot, '../buono-launchpad/site/app/components/Launchpad.tsx');
const launchpadStyles = path.resolve(runlighterRoot, '../buono-launchpad/site/app/globals.css');
const dataRoot = path.resolve(runlighterRoot, 'launchpads/buono/data');

const source = readFileSync(launchpadSource, 'utf8');
const styles = readFileSync(launchpadStyles, 'utf8');
const readJson = (relativePath) => JSON.parse(readFileSync(path.join(dataRoot, relativePath), 'utf8'));
const evidence = readJson('launchpad-evidence.json');
const finance = readJson('datasets/finance.json');
const monthly = readJson('datasets/finance_monthly.json');
const assumptions = readJson('datasets/finance_assumptions.json');
const fitout = readJson('datasets/fitout.json');

function close(actual, expected, tolerance, label) {
  assert.ok(Number.isFinite(actual), `${label}: actual value is not finite`);
  assert.ok(Number.isFinite(expected), `${label}: expected value is not finite`);
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}, tolerance ${tolerance}`,
  );
}

function requiredSourceFragment(fragment, label) {
  assert.ok(source.toLowerCase().includes(fragment.toLowerCase()), `Finance UI is missing ${label}: ${fragment}`);
}

const financeSource = source.slice(source.indexOf('function Finance('), source.indexOf('function Operations('));
assert.equal((financeSource.match(/<FinanceNumberField/g) ?? []).length, 6, 'Finance must expose exactly six typed number fields');
assert.equal((financeSource.match(/type="range"/g) ?? []).length, 1, 'Finance must expose exactly one slider');
assert.ok(financeSource.indexOf('className="finance-sales-panel"') < financeSource.indexOf('className="finance-top-results"'), 'Sales slider must precede result cards');
assert.ok(financeSource.indexOf('className="finance-input-grid"') < financeSource.indexOf('className="finance-preset-bar"'), 'Six typed figures must precede optional presets');
assert.ok(styles.includes('.finance-input-shell:focus-within') && styles.includes("input[type='range']:focus-visible"), 'Finance controls must retain visible keyboard focus');

for (const [fragment, label] of [
  ['Change six numbers to see what Buono needs to sell.', 'the compact finance instruction'],
  ['MODELLED BREAK-EVEN', 'the top break-even result'],
  ['Sales per month', 'the sales input'],
  ['Orders per day', 'the volume input'],
  ['Food COGS', 'the COGS input'],
  ['Wages per month', 'the wages input'],
  ['Rent per month', 'the monthly rent input'],
  ['Fit-out', 'the fit-out input'],
  ['FOOD GP', 'the derived gross-profit result'],
  ['data-sales-slider', 'the single sales slider'],
  ['Break-even {aud(breakEvenGross)}', 'the break-even slider marker'],
  ['DAILY SALES PLAN', 'the daily sales plan'],
  ['Open the 18-item daily mix', 'the item-level daily plan'],
  ['onBlur={commit}', 'draft-friendly number entry'],
  ['if (nextValue === Number(formattedValue))', 'no-op blur protection'],
  ['const salesMinimum = 0;', 'shared sales minimum'],
  ['const salesMaximum = 300_000;', 'shared sales maximum'],
  ['setOrdersPerDay(ordersFromSales(nextSales));', 'sales-to-volume linking'],
  ['Math.round(dailyOrders * baseAverageTicket * daysPerMonth)', 'volume-to-sales linking'],
  ['CUSTOM SCENARIO', 'the custom-input state'],
  ['const modelMatchToleranceAud = 0.25;', 'the tightened model-match tolerance'],
  ['const netSales = grossSales / (1 + assumptions.gst.rate);', 'the GST-exclusive revenue calculation'],
  ['const cashWages = monthlyCashWages;', 'the editable monthly wages calculation'],
  ['const outgoings = monthlyRent * occupancy.assumed_outgoings_fraction_of_rent;', 'the retained property outgoings treatment'],
  ['const workersComp = wagesPlusSuper * 0.017;', 'the workers compensation reserve'],
  ['let cumulativeCash = -fitoutAllowance;', 'the opening fit-out cash treatment'],
]) {
  requiredSourceFragment(fragment, label);
}

for (const removed of [
  'Paid employee hours per month',
  'Blended cash wage per hour',
  'Owner hours not costed per month',
  'Fit-out basis',
  'Range point',
  'Apply 33% target sensitivity',
]) {
  assert.ok(!financeSource.includes(removed), `Obsolete finance control remains visible: ${removed}`);
}

assert.deepEqual(evidence.datasets.finance, finance, 'Published finance dataset differs from the launchpad evidence payload');
assert.deepEqual(evidence.datasets.finance_monthly, monthly, 'Published monthly dataset differs from the launchpad evidence payload');
assert.deepEqual(evidence.datasets.finance_assumptions, assumptions, 'Published assumptions differ from the launchpad evidence payload');
assert.deepEqual(evidence.datasets.fitout, fitout, 'Published fit-out dataset differs from the launchpad evidence payload');

assert.equal(assumptions.gst.rate, 0.1, 'GST rate must be 10%');
assert.match(assumptions.gst.revenue_treatment, /Gross sales include GST/i);
assert.match(assumptions.gst.cost_treatment, /excluding GST where recoverable/i);
assert.match(assumptions.gst.net_gst_payable_treatment, /UNKNOWN/i);
assert.deepEqual(
  Object.fromEntries(Object.entries(assumptions.demand_scenarios).map(([key, value]) => [key, value.multiplier])),
  { low: 0.75, base: 1, high: 1.3 },
  'Demand multipliers have drifted',
);

const propertyIds = Object.keys(assumptions.property_demand).sort();
const staffingModes = ['fully_staffed', 'owner_operated'];
const demandScenarios = ['low', 'base', 'high'];
assert.equal(propertyIds.length, 3, 'Expected exactly three finance properties');
assert.equal(finance.cases.length, 18, 'Expected three properties by two staffing modes by three demand cases');
assert.equal(monthly.rows.length, 18 * 24, 'Expected 24 monthly rows for every canonical case');
assert.equal(new Set(finance.cases.map((item) => item.case_id)).size, 18, 'Finance case IDs must be unique');

function defaultFitout(propertyId) {
  const upstream = fitout.property_deltas.find((item) => item.property_id === propertyId)?.starting_scenario;
  const scenario = fitout.scenarios.find((item) => item.id === upstream)
    ?? fitout.scenarios.find((item) => item.id === 'MODERATE_ADAPTATION')
    ?? fitout.scenarios[1]
    ?? fitout.scenarios[0];
  assert.ok(scenario, `No fit-out scenario is available for ${propertyId}`);
  return scenario.total_aud_ex_gst.base;
}

function calculateCase(propertyId, staffingMode, demandScenario, overrides = {}) {
  const sourceRows = monthly.rows
    .filter((row) => row.property_id === propertyId
      && row.staffing_mode === staffingMode
      && row.demand_scenario === demandScenario)
    .sort((left, right) => left.month_number - right.month_number);
  assert.equal(sourceRows.length, 24, `Expected 24 rows for ${propertyId}/${staffingMode}/${demandScenario}`);

  const occupancy = assumptions.occupancy[propertyId];
  const staffing = assumptions.staffing[staffingMode];
  const matureSales = overrides.matureSales ?? Math.round(
    assumptions.property_demand[propertyId].mature_monthly_gross_sales_inc_gst_aud
      * assumptions.demand_scenarios[demandScenario].multiplier,
  );
  const monthlyRent = overrides.monthlyRent ?? occupancy.assumed_annual_rent_ex_gst_aud / 12;
  const coreFoodCogsPercent = overrides.coreFoodCogsPercent
    ?? Number((assumptions.cogs.core_food_alpha_fraction_of_net_sales * 100).toFixed(1));
  const monthlyCashWages = overrides.monthlyCashWages
    ?? staffing.paid_hours_by_demand[demandScenario] * staffing.blended_cash_rate_aud_by_demand[demandScenario];
  const ownerHours = overrides.ownerHours ?? staffing.owner_hours_not_costed[demandScenario];
  const ownerLabourRate = overrides.ownerLabourRate ?? 38;
  const fitoutAllowance = overrides.fitoutAllowance ?? defaultFitout(propertyId);

  let cumulativeCash = -fitoutAllowance;
  const rows = sourceRows.map((row) => {
    const grossSales = matureSales * row.demand.ramp_factor;
    const netSales = grossSales / (1 + assumptions.gst.rate);
    const outputGst = grossSales - netSales;
    const shares = row.revenue.revenue_type_shares;
    const blendedCogsRate = shares.core_food * (coreFoodCogsPercent / 100)
      + shares.non_alcoholic_beverage * assumptions.cogs.non_alcoholic_beverage_fraction_of_net_sales
      + shares.alcohol * assumptions.cogs.alcoholic_beverage_fraction_of_net_sales;
    const cogs = netSales * blendedCogsRate;
    const merchant = grossSales
      * assumptions.merchant_and_variable_costs.card_share_of_gross_sales
      * assumptions.merchant_and_variable_costs.merchant_rate;
    const marketing = netSales * assumptions.merchant_and_variable_costs.marketing_fraction_of_net_sales;
    const cashWages = monthlyCashWages;
    const superannuation = cashWages * assumptions.superannuation.rate;
    const wagesPlusSuper = cashWages + superannuation;
    const workersComp = wagesPlusSuper * 0.017;
    const payrollTax = Math.max(0, wagesPlusSuper - row.payroll_tax.threshold_for_month_aud)
      * assumptions.payroll_tax.rate;
    const staffCost = wagesPlusSuper + workersComp + payrollTax;
    const baselineWorkersComp = row.utilities_and_services.items_aud.workers_comp_reserve_calculator ?? 0;
    const nonLabourServices = row.utilities_and_services.total_aud - baselineWorkersComp;
    const outgoings = monthlyRent * occupancy.assumed_outgoings_fraction_of_rent;
    const fixedCosts = staffCost + nonLabourServices + monthlyRent + outgoings;
    const ebitda = netSales - cogs - merchant - marketing - fixedCosts;
    const merchantFractionOfNet = assumptions.merchant_and_variable_costs.card_share_of_gross_sales
      * assumptions.merchant_and_variable_costs.merchant_rate
      * (1 + assumptions.gst.rate);
    const contributionMargin = 1 - blendedCogsRate - merchantFractionOfNet
      - assumptions.merchant_and_variable_costs.marketing_fraction_of_net_sales;
    const breakEvenGross = contributionMargin > 0
      ? fixedCosts / contributionMargin * (1 + assumptions.gst.rate)
      : 0;
    const breakEvenTransactions = breakEvenGross / row.revenue.average_ticket_inc_gst_aud;
    const ownerLabourValue = staffingMode === 'owner_operated' ? ownerHours * ownerLabourRate : 0;
    cumulativeCash += ebitda;
    return {
      source: row,
      grossSales,
      netSales,
      outputGst,
      cashWages,
      superannuation,
      workersComp,
      payrollTax,
      staffCost,
      ownerLabourValue,
      ebitda,
      cumulativeCash,
      breakEvenGross,
      breakEvenTransactions,
    };
  });

  const total = (key) => rows.reduce((sum, row) => sum + row[key], 0);
  return {
    rows,
    grossSales: total('grossSales'),
    netSales: total('netSales'),
    outputGst: total('outputGst'),
    ebitda: total('ebitda'),
    closingCash: rows.at(-1).cumulativeCash,
    ownerLabourValue: total('ownerLabourValue'),
  };
}

for (const propertyId of propertyIds) {
  for (const staffingMode of staffingModes) {
    for (const demandScenario of demandScenarios) {
      const label = `${propertyId}/${staffingMode}/${demandScenario}`;
      const calculated = calculateCase(propertyId, staffingMode, demandScenario);
      const canonical = finance.cases.find((item) => item.property_id === propertyId
        && item.staffing_mode === staffingMode
        && item.demand_scenario === demandScenario);
      assert.ok(canonical, `Missing canonical case ${label}`);

      for (const [index, row] of calculated.rows.entries()) {
        const sourceRow = row.source;
        close(row.grossSales, sourceRow.revenue.gross_sales_inc_gst_aud, 0.02, `${label} month ${index + 1} gross sales`);
        close(row.netSales, sourceRow.revenue.net_sales_ex_gst_aud, 0.02, `${label} month ${index + 1} net sales`);
        close(row.outputGst, sourceRow.gst.output_gst_on_sales_aud, 0.02, `${label} month ${index + 1} output GST`);
        close(row.cashWages, sourceRow.labour.cash_wages_aud, 0.02, `${label} month ${index + 1} wages`);
        close(row.superannuation, sourceRow.labour.superannuation_aud, 0.02, `${label} month ${index + 1} superannuation`);
        close(row.payrollTax, sourceRow.payroll_tax.expense_aud, 0.02, `${label} month ${index + 1} payroll tax`);
        close(row.ebitda, sourceRow.result.shop_ebitda_aud, 0.02, `${label} month ${index + 1} EBITDA`);
        close(row.cumulativeCash, sourceRow.cashflow.cumulative_cash_after_known_modelled_capex_aud, 0.2, `${label} month ${index + 1} cumulative cash`);
        close(row.breakEvenGross, sourceRow.break_even.monthly_gross_sales_inc_gst_aud, 0.02, `${label} month ${index + 1} break-even gross sales`);
      }

      close(calculated.grossSales, canonical.twenty_four_month.gross_sales_inc_gst_aud, 0.2, `${label} 24-month gross sales`);
      close(calculated.ebitda, canonical.twenty_four_month.shop_ebitda_aud, 0.2, `${label} 24-month EBITDA`);
      close(calculated.closingCash, canonical.twenty_four_month.closing_cumulative_cash_after_known_modelled_capex_aud, 0.2, `${label} closing cash`);
    }
  }
}

const sensitivityProperty = '35c-ross-forest-lodge';
const sensitivityBase = calculateCase(sensitivityProperty, 'owner_operated', 'base');
const salesSensitivity = calculateCase(sensitivityProperty, 'owner_operated', 'base', {
  matureSales: assumptions.property_demand[sensitivityProperty].mature_monthly_gross_sales_inc_gst_aud + 11_000,
});
close(salesSensitivity.rows[11].grossSales - sensitivityBase.rows[11].grossSales, 11_000, 0.001, 'Sales sensitivity gross delta');
close(salesSensitivity.rows[11].netSales - sensitivityBase.rows[11].netSales, 10_000, 0.001, 'Sales sensitivity net delta');
close(salesSensitivity.rows[11].outputGst - sensitivityBase.rows[11].outputGst, 1_000, 0.001, 'Sales sensitivity GST delta');

const fitoutSensitivity = calculateCase(sensitivityProperty, 'owner_operated', 'base', {
  fitoutAllowance: defaultFitout(sensitivityProperty) + 50_000,
});
close(fitoutSensitivity.ebitda, sensitivityBase.ebitda, 0.001, 'Fit-out must not change shop EBITDA');
close(fitoutSensitivity.closingCash - sensitivityBase.closingCash, -50_000, 0.001, 'Fit-out opening cash delta');

const staffingSensitivity = calculateCase(sensitivityProperty, 'owner_operated', 'base', {
  monthlyCashWages: sensitivityBase.rows[11].cashWages + 3_800,
});
close(staffingSensitivity.rows[11].cashWages - sensitivityBase.rows[11].cashWages, 3_800, 0.001, 'Monthly cash wages delta');
close(
  staffingSensitivity.rows[11].staffCost - sensitivityBase.rows[11].staffCost,
  3_800 * (1 + assumptions.superannuation.rate) * 1.017,
  0.001,
  'Monthly employer staffing delta',
);

const rentSensitivity = calculateCase(sensitivityProperty, 'owner_operated', 'base', {
  monthlyRent: assumptions.occupancy[sensitivityProperty].assumed_annual_rent_ex_gst_aud / 12 + 1_000,
});
close(rentSensitivity.rows[11].ebitda - sensitivityBase.rows[11].ebitda, -1_150, 0.001, 'Monthly rent and linked outgoings delta');

const ownerSensitivity = calculateCase(sensitivityProperty, 'owner_operated', 'base', { ownerHours: 420 });
close(ownerSensitivity.ebitda, sensitivityBase.ebitda, 0.001, 'Owner labour must remain outside shop EBITDA');
assert.ok(ownerSensitivity.ownerLabourValue > sensitivityBase.ownerLabourValue, 'Owner labour sensitivity must change its separate economic value');

function calculateDailyMenuPlan(dishes, matureSales = 170_000) {
  assert.equal(dishes.length, 18, 'Daily menu plan requires all 18 dishes');
  const categoryIds = ['pasta', 'focaccia', 'salad'];
  const categoryWeights = Object.fromEntries(categoryIds.map((category) => [category, dishes
    .filter((dish) => dish.category === category)
    .reduce((sum, dish) => sum + dish.sales_mix_weight, 0)]));
  const categoryAverageNetPrices = Object.fromEntries(categoryIds.map((category) => {
    const weightedNetPrice = dishes
      .filter((dish) => dish.category === category)
      .reduce((sum, dish) => sum + dish.costing.selling_price_inc_gst / (1 + assumptions.gst.rate) * dish.sales_mix_weight, 0);
    return [category, weightedNetPrice / categoryWeights[category]];
  }));
  const categoryUnits = { pasta: 0, focaccia: 0, salad: 0 };
  for (const daypart of assumptions.dayparts) {
    const foodRevenue = matureSales * daypart.revenue_share / (1 + assumptions.gst.rate) * daypart.revenue_type_mix.core_food;
    const averageFoodPrice = categoryIds.reduce((sum, category) => sum
      + daypart.menu_category_mix_of_food[category] * categoryAverageNetPrices[category], 0);
    const foodUnits = foodRevenue / averageFoodPrice;
    for (const category of categoryIds) {
      categoryUnits[category] += foodUnits * daypart.menu_category_mix_of_food[category] / 30.4;
    }
  }
  return {
    categoryUnits,
    items: dishes.map((dish) => ({
      stableId: dish.stable_id,
      unitsPerDay: categoryUnits[dish.category] * dish.sales_mix_weight / categoryWeights[dish.category],
    })),
  };
}

const dailyPlan = calculateDailyMenuPlan(evidence.datasets.menu.dishes);
assert.deepEqual(
  Object.fromEntries(Object.entries(dailyPlan.categoryUnits).map(([category, units]) => [category, Math.round(units)])),
  { pasta: 52, focaccia: 70, salad: 51 },
  'Daily menu category plan has drifted',
);
assert.equal(dailyPlan.items.length, 18, 'Daily item plan must contain all 18 dishes');
assert.ok(dailyPlan.items.every((item) => Number.isFinite(item.unitsPerDay) && item.unitsPerDay > 0), 'Every daily item target must be positive and finite');
assert.throws(() => calculateDailyMenuPlan(evidence.datasets.menu.dishes.slice(1)), /requires all 18 dishes/, 'Daily-menu negative control did not detect a missing dish');

console.log('BUONO_FINANCE_CONTROLS_VERIFIED');
