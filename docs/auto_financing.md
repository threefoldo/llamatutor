Below is an expanded design description that details each mini‐game’s web page layout and interactive elements. Each page is crafted to immerse students in a realistic auto finance scenario while guiding them to perform key calculations. The design ensures that every page presents a clear context, interactive document displays, input fields for calculations, and LLM-powered hints and feedback.

---

## General Page Layout

- **Header & Progress Bar:**  
  Every page features a header displaying the current level and mini-game title along with a progress indicator. This helps students understand where they are in the simulation.

- **Scenario Sidebar:**  
  A side panel shows the “real life” context. Here, students see:
  - A brief narrative of the client’s situation.
  - Relevant images (e.g., car photos, dealership invoices).
  - A snapshot of documents such as loan offers, purchase agreements, or lease contracts.

- **Document Display Area:**  
  The central section presents detailed financial documents. These can include tables, graphs, or scrollable text that mimic real auto finance documents. The documents are interactive—for example, parts may be highlighted on hover to focus attention on key numbers.

- **Calculation Input Fields:**  
  Clearly labeled numerical input boxes are provided in multiple locations:
  - A primary field for the final calculated answer.
  - Supplementary fields for showing intermediate steps.
  - A free-text explanation box where students describe their approach or reasoning.

- **LLM Interaction Pane:**  
  A conversational chat box (typically on the right side) offers hints, clarifications, and feedback. It is context-aware and adapts based on the student’s progress and input.

- **Navigation Controls:**  
  Buttons at the bottom allow students to submit their answers, review hints, or navigate between mini-games.

---

## Level 1: Loan Fundamentals

### Mini-Game 1.1: Monthly Payment Calculation

- **Visual Context:**  
  The page shows two side-by-side panels of loan offers. Each panel displays:
  - Loan amount, APR, and term.
  - A realistic offer letter design.
  - A contextual image of a car or dealership.

- **Interactive Actions:**  
  - **Calculation Input:** Students enter their monthly payment calculations using the PMT formula in designated fields.
  - **Process Explanation:** A multi-line text box encourages them to outline their working steps.
  - **LLM Guidance:** A chat window offers hints if the student seems stuck, such as prompting them to identify the interest rate or term.

### Mini-Game 1.2: Total Interest Comparison

- **Visual Context:**  
  The same loan offer details are revisited, now accompanied by a timeline graphic that breaks down monthly payments into principal and interest components.
  
- **Interactive Actions:**  
  - **Calculation Input:** Separate fields allow students to input the total interest calculated for each loan option.
  - **Explanatory Field:** A dedicated text area asks them to explain why a lower monthly payment might not yield lower total interest.
  - **LLM Assistance:** Hints pop up to remind students to multiply the monthly interest component by the number of periods or to consider cumulative interest over time.

### Mini-Game 1.3: Amortization Analysis

- **Visual Context:**  
  An interactive amortization schedule (presented as a scrollable table or graph) shows how the balance, principal, and interest evolve over time.
  
- **Interactive Actions:**  
  - **Detail Inspection:** Students can click on or hover over individual payment periods to reveal detailed breakdowns.
  - **Calculation Input:** Fields prompt them to compute the remaining balance or to identify when the interest component declines.
  - **Conceptual Feedback:** A text box invites a short explanation of the changes over time, with the LLM offering visual or textual hints when needed.

---

## Level 2: Purchase Cost Analysis

### Mini-Game 2.1: Loan Amount Calculation

- **Visual Context:**  
  The page displays a purchase agreement mock-up, complete with vehicle price, fees, trade-in value, and down payment. Graphical elements (like highlighted numbers and callouts) draw attention to each key value.

- **Interactive Actions:**  
  - **Calculation Input:** A primary field collects the final loan amount calculation after accounting for fees, trade-in, and down payment.
  - **Step-by-Step Breakdown:** Supplementary fields let students break the calculation into parts (e.g., total price, subtractions for trade-in and down payment).
  - **LLM Prompts:** The chat box provides guidance on the order of operations (e.g., “Remember to add the fees before subtracting trade-in value”).

### Mini-Game 2.2: Total Cost Calculation

- **Visual Context:**  
  A comprehensive breakdown of costs appears, including interest, fees, and additional expenses. Infographics such as pie charts or bar graphs illustrate the proportion of each cost element.

- **Interactive Actions:**  
  - **Calculation Input:** Students fill in fields for the lifetime cost of ownership.
  - **Rationale Box:** They describe their method for combining upfront and ongoing costs.
  - **LLM Interaction:** The LLM offers step-by-step guidance and checks that every cost component is considered.

### Mini-Game 2.3: Monthly Payment with Fees

- **Visual Context:**  
  The page contrasts an advertisement (which might show a simplified monthly payment) with a detailed purchase agreement. Side-by-side layouts highlight discrepancies between advertised and actual costs.

- **Interactive Actions:**  
  - **Calculation Input:** Input fields allow students to re-calculate the monthly payment by integrating all relevant fees.
  - **Interactive Tooltips:** Hovering over fee items triggers pop-ups explaining how each fee influences the final payment.
  - **LLM Chat:** The system offers prompts to help students differentiate between upfront fees and recurring monthly costs.

---

## Level 3: Refinancing Analysis

### Mini-Game 3.1: Refinance Payment Calculation

- **Visual Context:**  
  This page displays the current loan details next to a refinance offer. A split-screen design shows a “before” and “after” comparison, with graphical representations (like side-by-side bar charts) of the payment amounts.

- **Interactive Actions:**  
  - **Calculation Input:** Students input the new monthly payment based on the refinance terms.
  - **Dynamic Calculators:** Optional sliders or input fields let them adjust remaining balance and term to see instant recalculations.
  - **LLM Guidance:** The chat provides hints such as “Check the remaining term on your current loan” when discrepancies arise.

### Mini-Game 3.2: Refinance Interest Savings

- **Visual Context:**  
  A detailed fee schedule and side-by-side interest cost summaries are displayed. An interactive comparison table helps students visually parse the savings over time.

- **Interactive Actions:**  
  - **Calculation Input:** Separate fields gather the computed total interest for both the current and the new loan.
  - **Checklist/Diagram:** A visual checklist reminds students to include all refinancing costs (such as fees).
  - **LLM Prompts:** The LLM asks targeted questions (e.g., “Have you factored in the refinance fee?”) to ensure accuracy.

### Mini-Game 3.3: Early Payoff Analysis

- **Visual Context:**  
  An early payoff scenario is presented with a dynamic timeline showing how a lump sum payment changes the loan’s amortization. Graphs update in real time as parameters are adjusted.

- **Interactive Actions:**  
  - **Calculation Input:** Fields enable students to calculate the revised schedule and interest savings after an early payoff.
  - **Interactive Amortization Table:** Students can click on specific periods to see recalculated balances.
  - **LLM Assistance:** The chat offers suggestions such as “Try recalculating the interest on the reduced balance” if errors are detected.

---

## Level 4: Lease vs. Buy Decision

### Mini-Game 4.1: Total Lease Cost

- **Visual Context:**  
  The page features a lease agreement document along with images of a vehicle and a lease contract. Key terms like mileage allowance, fees, and lease duration are highlighted.

- **Interactive Actions:**  
  - **Calculation Input:** Students enter fields that add up all lease payments and fees over the lease term.
  - **Hover Explanations:** Interactive tooltips provide brief explanations for each cost item (e.g., “What is included in the disposition fee?”).
  - **LLM Chat:** Provides additional context on how to account for costs that are unique to leases.

### Mini-Game 4.2: Buy Option Analysis

- **Visual Context:**  
  The page displays the purchase offer alongside projected resale value data. A split-screen or toggle view lets students compare graphical representations of depreciation against ownership costs.

- **Interactive Actions:**  
  - **Calculation Input:** Students fill in fields to calculate the total cost of ownership, including depreciation.
  - **Interactive Slider:** A slider allows students to adjust projected resale value to see how it affects net cost.
  - **LLM Guidance:** The chat box prompts them to consider the impact of depreciation on long-term ownership.

### Mini-Game 4.3: Lease vs. Buy Recommendation

- **Visual Context:**  
  A final comparative dashboard appears, summarizing both the lease and purchase options. A decision matrix or comparative chart helps visualize the trade-offs.

- **Interactive Actions:**  
  - **Calculation Input:** Fields prompt students to complete a final calculation that weighs both options.
  - **Justification Box:** A larger text area asks for a written recommendation, including the reasoning behind their decision.
  - **Interactive Tooltips:** Hoverable elements explain factors such as total cost, residual value, and risk.
  - **LLM Support:** The chat asks probing questions to ensure that the recommendation is well-supported by calculations.

---

## Level 5: Advanced Topics

### Mini-Game 5.1: Balloon Payment Analysis

- **Visual Context:**  
  The page displays a balloon loan offer with visuals comparing a standard loan versus a balloon payment structure. Graphs show how the final large payment contrasts with regular payments.
  
- **Interactive Actions:**  
  - **Calculation Input:** Students input the balloon payment amount and compare overall costs.
  - **Adjustable Simulation:** Sliders allow real-time simulation of different balloon sizes and terms.
  - **LLM Prompts:** The chat explains key differences and asks, “What impact does the balloon payment have on total interest?”

### Mini-Game 5.2: GAP Insurance Evaluation

- **Visual Context:**  
  A detailed GAP insurance offer is presented alongside a vehicle depreciation curve. Interactive charts plot the remaining loan balance against depreciation over time.
  
- **Interactive Actions:**  
  - **Calculation Input:** Fields for students to calculate the loan-to-value gap at different time points.
  - **Graphical Interaction:** Hovering over the depreciation curve reveals numerical data points.
  - **LLM Guidance:** The chat offers hints like “Compare the current loan balance with the estimated vehicle value” to ensure proper analysis.

### Mini-Game 5.3: Credit Score Impact

- **Visual Context:**  
  Multiple loan offers are shown, differentiated by credit score tiers. Comparative tables and charts illustrate differences in interest rates and terms.
  
- **Interactive Actions:**  
  - **Calculation Input:** Fields enable the calculation of savings gained from an improved credit score.
  - **Side-by-Side Comparison:** An interactive table allows students to see how slight changes in interest rates affect monthly payments.
  - **LLM Chat:** Prompts guide the student to isolate variables and compute the exact benefit of credit improvement.

---

## Final Notes

This design ensures that every mini-game page is more than just a static display—it is an interactive learning environment. Students are continuously prompted to engage in calculations, justify their reasoning, and receive adaptive feedback through an integrated LLM chat. This immersive experience is intended to transform abstract finance concepts into concrete, real-world problems that require careful calculation and critical thinking.

By combining realistic documents, dynamic visual aids, and a clean, intuitive interface, the simulation encourages students to actively engage with financial data and hone their calculation skills in contexts they might encounter in professional auto financing situations.