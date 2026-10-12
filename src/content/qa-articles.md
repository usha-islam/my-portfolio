# Practical QA: Six Articles on Testing and Decision-Making

These articles explain practical testing approaches through illustrative scenarios. The examples are learning walkthroughs, not reports of production incidents.

---

# 1. Unclear Requirements: What Should a QA Engineer Do Next?

**Excerpt:** Good testing starts before the first test case. Here is how I would turn an unclear requirement into useful questions and testable examples.

**Tags:** Requirements Analysis, Test Design, QA Collaboration

“Users should be able to cancel an order.”

It sounds like a complete requirement—until someone asks what happens after the order has shipped.

Can every user cancel? Is there a time limit? Does cancellation trigger a refund? What if the user clicks Cancel twice?

Each answer changes what we need to build and test. If the team answers these questions differently, a feature can behave exactly as a developer intended and still disappoint the user.

## Start with the user’s goal

For this example, I would first clarify the purpose: a customer needs to stop an eligible order before fulfilment progresses too far.

Then I would separate what the requirement actually says from what I am assuming. “Cancellation is allowed before dispatch” may sound reasonable, but it is still an assumption until the responsible stakeholder confirms it.

An assumption written down is a question the team can resolve. An assumption left unspoken can become a defect.

## Ask questions that change the behaviour

Instead of asking “Can you explain this feature?”, I would bring specific cases:

| Area | Question to resolve |
| --- | --- |
| Eligibility | Which order statuses allow cancellation? |
| Ownership | Can a customer cancel only their own orders? |
| Timing | What happens if dispatch starts while cancellation is being submitted? |
| Payment | Does an accepted cancellation start a refund, and how is its progress shown? |
| Repeated actions | What should happen if the same cancellation is submitted again? |
| Failure | What should the user see if cancellation cannot be completed? |

These questions give the product owner and developer concrete decisions to discuss.

## Turn the answers into examples

Suppose the team agrees that customers may cancel their own confirmed orders before dispatch. I would turn that agreement into acceptance criteria such as:

> Given a customer owns a confirmed order that has not been dispatched, when cancellation succeeds, the order becomes Cancelled and remains cancelled after refresh.

> Given an order has already been dispatched, when the customer attempts cancellation, the system rejects the action and explains why.

> Given cancellation has already succeeded, when the same request is submitted again, the system does not repeat any associated refund action.

These are proposed examples for this scenario, not universal cancellation rules. Refund timing, inventory restoration and notifications still need their own agreed behaviour.

## Build tests from the decisions

I would cover an eligible order, an ineligible order, another customer’s order, repeated submission and a status change during submission. Hiding a Cancel button is only one check; the backend must also enforce the agreed restrictions.

If a decision is still missing, I would record the question, its owner and the affected tests. Independent checks can continue, but I would not mark uncertain behaviour as passed using my own invented expectation.

Clear requirements do not remove every question. They give the team a shared basis for answering them—and give QA a defensible reason for each expected result.

---

# 2. What Should We Test First? A Practical Guide to Risk-Based Testing

**Excerpt:** When testing time is limited, the order matters. A practical walkthrough of choosing tests based on potential harm and the likelihood of failure.

**Tags:** Risk-Based Testing, Test Planning, Prioritization

Imagine a release includes a new coupon rule, an updated checkout calculation and a redesigned profile page. There is one hour left for testing.

Starting with the easiest screen might produce a satisfying list of passed tests. It might also leave the most expensive failure undiscovered.

My starting question would be: **If this change fails, who is affected, and how serious would the result be?**

## Make the risks specific

“Checkout is risky” is too broad to guide a test. “The discount may be subtracted twice, causing the customer to be charged the wrong amount” points toward a useful investigation.

Risk-based testing uses risk to guide testing priorities and effort. Two useful dimensions are impact—the harm a failure could cause—and likelihood—how plausible that failure is in the current context.

For this illustrative release, I would discuss an initial assessment like this with the team:

| Possible failure | Why it deserves attention | Initial priority |
| --- | --- | --- |
| Payment amount differs from the confirmed order total | Direct financial impact; calculation changed | Highest |
| Coupon works for an ineligible cart | New eligibility logic; incorrect discount | High |
| Checkout fails without a coupon | Existing core journey may be affected | High |
| Profile spacing looks uneven | Primarily visual, assuming controls remain usable | Lower |

These priorities depend on the scenario. A profile problem that prevents users from completing a required action deserves a different assessment.

## Choose tests that answer the biggest questions

For the coupon change, I would start with a successful eligible checkout, then check ineligible and boundary conditions. If the threshold is BDT 1,000 and the system supports two decimal places, useful values are BDT 999.99, BDT 1,000.00 and BDT 1,000.01.

I would also check removing the coupon, changing the cart after applying it, and completing checkout without any coupon. Those paths help reveal whether the change has affected the existing purchase flow.

The expected total should come from the agreed calculation rules. Comparing two screens is useful, but both screens could display the same incorrect number.

## Use time as a budget, not a guarantee

An illustrative one-hour plan could be:

- **10 minutes:** Confirm the changes, known issues, test data and environment readiness.
- **30 minutes:** Check the highest-impact purchase and calculation scenarios.
- **15 minutes:** Explore boundaries, negative cases and nearby regression risks.
- **5 minutes:** Report evidence, unresolved defects and untested areas.

If the first test finds a wrong charge amount, I would revisit the plan immediately. The schedule should respond to evidence.

## Explain the remaining uncertainty

A useful completion note says what was covered and what remains open:

> Eligible and ineligible coupon paths were checked on desktop. Payment totals matched the agreed examples. Mobile checkout and concurrent coupon redemption remain untested.

Risk-based testing does not prove that everything else is safe. It helps spend limited time deliberately and makes the remaining uncertainty visible to the people making the release decision.

**Further reading:** [ISTQB definition of risk-based testing](https://glossary.istqb.org/en_US/term/risk-based-testing).

---

# 3. The API Returned 200 OK. Is It Really Working?

**Excerpt:** A successful status code is one part of an API check. Here is how I would verify the data, business outcome and access rules behind the response.

**Tags:** API Testing, Postman, Business Logic

Suppose a profile update request returns `200 OK`. The response says the phone number was updated. After refreshing the profile, however, the old number returns.

Would I call that test passed? No. The response looked successful, but the expected outcome was not demonstrated.

A status code tells us how the server represents the outcome of the request. It cannot independently prove that the implementation performed every required action correctly.

## Define success before sending the request

Consider an illustrative API where an authenticated user updates their own profile using `PATCH /api/profile`.

For this example, assume the contract specifies an immediate update, a `200` response and an updated profile object. My test expectations would include:

- The response uses the documented status and format.
- The profile belongs to the signed-in test user.
- The returned phone number matches the submitted value.
- A subsequent read returns the updated number.
- Fields outside the requested change remain intact.

Another API could document a different status or asynchronous processing. Its tests should follow that contract.

## Check meaningful values in Postman

Here is an illustrative response:

```json
{
  "id": "user-104",
  "name": "Demo User",
  "phone": "+8801700000000"
}
```

For this controlled test fixture, I would add assertions such as:

```javascript
pm.test("Profile update returns the documented status", function () {
  pm.response.to.have.status(200);
});

pm.test("Response identifies the expected user and phone", function () {
  const profile = pm.response.json();
  pm.expect(profile.id).to.eql("user-104");
  pm.expect(profile.phone).to.eql("+8801700000000");
});
```

Postman supports named tests and assertions through `pm.test` and `pm.expect`. These assertions demonstrate a small check against sample data; they are not a complete reusable collection.

## Follow the change beyond the response

Next, I would call `GET /api/profile` as the same user and verify the saved value. For a stronger check, I would inspect the result through a fresh application read and compare unrelated fields with their original values.

If the product documents eventual consistency, an immediate old value may be expected. In that case, I would test the agreed completion window and intermediate state instead of adding an arbitrary wait until the test passes.

## Try requests that should not succeed

Using test accounts in an authorized environment, I would also check missing authentication, invalid phone data and an attempt to change a protected field such as the user’s role.

The important questions are whether the API rejects or safely ignores invalid changes according to its contract, returns useful feedback and leaves the stored data in the correct state. A rejected request should not secretly apply part of a change unless that behaviour is explicitly supported.

For APIs that accept record IDs, I would include cross-account access checks using records owned by separate test users.

My pass condition would connect the request to the observable business result. The status, response body, persisted data and access rules should tell a consistent story.

**Further reading:** [Postman test script examples](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples/).

---

# 4. Small Change, Wider Impact: Choosing the Right Regression Tests

**Excerpt:** A small requirement can affect a larger workflow. Here is how I would choose regression tests by tracing dependencies and following changed data.

**Tags:** Regression Testing, Impact Analysis, Test Coverage

“We only changed the delivery fee.”

That sentence describes the size of the request. It does not tell us the size of its impact.

A delivery fee may appear in the cart, checkout, payment request, order history and invoice. It may also affect refunds, depending on the business rules. A correct value on one screen does not prove consistency across the journey.

## Understand where the change lives

Imagine the delivery fee changes from BDT 60 to BDT 80 for new orders in one delivery zone. Before choosing regression tests, I would ask:

- Is the fee changed in configuration, shared calculation logic or one screen?
- Which zones and delivery methods are affected?
- Does free-delivery eligibility still apply?
- What happens to carts created before the change?
- Should existing orders preserve their original charges?

The developer can help identify technical dependencies. Product stakeholders can confirm the intended business boundaries. QA needs both perspectives.

## Follow the value through the journey

I would use a compact impact map:

| Area | Regression question |
| --- | --- |
| Cart | Is the applicable fee displayed and included correctly? |
| Checkout | Does changing the address recalculate the fee? |
| Payment | Does the amount submitted match the confirmed payable total? |
| Order details | Is the accepted fee saved with the order? |
| Invoice | Does it reflect the order’s agreed charge? |
| Existing orders | Are historical charges preserved as required? |

For a sample basket of BDT 1,200 with no other charges or discounts, the new total would be BDT 1,280. I would calculate that expectation independently, then compare the relevant outputs against it.

## Cover the edges of the change

The affected zone needs testing, but an unaffected zone is valuable too. It can reveal whether the new fee was accidentally applied globally.

I would also include an existing cart, an existing order and any free-delivery threshold. If the rule depends on addresses, changing an address after checkout has started is a useful exploratory path.

Tests for historical orders depend on the agreed policy; I would not assume every product stores or recalculates charges in the same way.

## Set a scope that matches the evidence

If the change is isolated configuration with understood consumers, focused regression may be appropriate. If a shared pricing service changed, the scope should expand to other price calculations that depend on it.

Unclear dependencies are themselves a reason to investigate further. A broader regression run may be needed when the team cannot confidently identify the affected areas.

I would record the chosen scope and its rationale, including exclusions. That makes it possible for a reviewer to challenge a missing dependency before release.

The title’s “twenty possible problems” is a reminder to look beyond the visible edit, not a target number of tests. The useful question is: **Where else is this value used, and what evidence shows those paths still work?**

---

# 5. What Should You Not Automate—and Why?

**Excerpt:** Automation is an investment. Here is how I would decide which checks deserve it, which need preparation and which still benefit from human exploration.

**Tags:** Test Automation, Test Strategy, Maintenance

A test takes five minutes to run manually. Automating it sounds like an obvious improvement.

But what if it runs once, takes several hours to automate and breaks whenever the interface changes?

Before writing a script, I would ask what repeated value that script is expected to provide. Execution time matters, but so do setup, maintenance, failure investigation and the importance of the behaviour being checked.

## Start with the purpose of the test

A stable, frequently repeated check with a clear expected result is often a useful candidate. A critical calculation checked on every build can provide fast, consistent feedback.

Other situations need a different approach:

| Situation | How I would approach it |
| --- | --- |
| Expected behaviour is still disputed | Resolve the requirement before encoding a pass condition |
| A prototype changes daily | Explore manually and automate stable underlying rules where useful |
| The question is whether a flow feels confusing | Use human evaluation, supported by automated checks where appropriate |
| A scenario will run only once | Compare scripting effort with risk, scale and reproducibility needs |
| External services or test data are unreliable | Improve control and observability before making the test a release gate |

These are decision points, not permanent bans on automation. Even a one-time task may deserve a script if it involves thousands of records or needs a reliable audit trail.

## Separate the rule from the interface

Imagine a registration form whose layout changes every few days. A large collection of UI tests may need constant repair.

If the email-validation rule is stable, I would consider checking that rule at a lower level, such as a unit or API test, while keeping a smaller number of end-to-end tests for the complete registration journey.

That choice depends on what each layer can observe. An API test cannot prove that the browser displays the right error or that a user can reach the submit button.

## Do not automate an uncertain answer

Suppose the team has not decided whether a discount applies before or after delivery charges. A script can consistently assert either result. Consistency does not make the chosen expectation correct.

I would clarify the rule first, identify representative examples and then automate the agreed checks.

Similarly, a visual comparison can detect a changed screen, but deciding whether a flow is understandable may require human judgment. Automation can support that evaluation without replacing the question being asked.

## Make failures useful

A valuable automated check should explain what failed well enough to support investigation. I would consider reliable test data, isolated setup, clear assertions and meaningful failure output as part of the investment.

Repeatedly rerunning a flaky test until it passes does not create confidence. Its cause needs investigation; if temporarily removed from a blocking suite, the gap should remain visible and have an owner.

My selection rule would be simple: automate where repeatable feedback justifies the total effort, and keep human attention available for exploration, uncertainty and judgment.

---

# 6. Would You Block the Release for This Bug?

**Excerpt:** Finding a defect is only the beginning. Here is how I would turn bug evidence into a clear release recommendation.

**Tags:** Release Readiness, Defect Analysis, QA Judgment

Two hours before release, testing finds a defect. Should the release stop?

“It is a bug” is not enough information. Neither is “the deadline is today.”

I would look at the failure, the people exposed to it, the consequences and the available controls. QA’s role is to make that evidence clear and recommend a course of action. The accountable release decision belongs to the people and process defined by the team.

## Describe the consequence, not only the symptom

Compare these illustrative findings:

| Finding | Initial recommendation and reason |
| --- | --- |
| A customer can access another customer’s invoice | Hold the affected release path while the access failure is addressed |
| A payment retry can charge a customer twice | Hold the affected payment path because repeated financial harm is possible |
| A heading has uneven spacing, with readability and interaction unaffected | Consider proceeding with a tracked fix |

The number of affected users is relevant, but low frequency does not automatically make a serious failure acceptable. A rarely exposed authorization defect can still have substantial impact.

## Gather evidence that changes the decision

Before recommending a release hold, I would establish as much as possible:

- The affected build, environment, accounts and conditions.
- Reproduction steps and supporting evidence.
- Which journeys and users may be exposed.
- Whether the issue affects money, data, access or task completion.
- Whether a workaround is practical for affected users.
- Whether the faulty feature can be safely disabled or isolated.
- What is known, what remains uncertain and who needs to decide.

Severity describes the seriousness of the impact. Priority describes how urgently the team should address it in context. Neither label should replace the explanation.

## Offer a concrete recommendation

For the duplicate-charge scenario, an example recommendation could be:

> Hold the affected payment release path. In this illustrative test, a retry after a timeout creates two charges for one order. A refresh does not undo the extra charge. Reassess after a fix is verified, or after a safe restriction that removes the affected path is tested and approved by the release owner.

This explains the action, reason and conditions for reconsideration. It is more useful than reporting “critical bug found.”

## Test the proposed mitigation too

“We can turn the feature off” is only helpful if the control works. I would verify that it blocks the relevant entry points and does not break another essential journey.

A rollback can reduce further exposure, but it may not undo charges, disclosures or changed records. Monitoring can reveal harm; it does not necessarily prevent it.

After a fix, I would repeat the original scenario and check related paths. For payment retries, that could include normal success, timeout recovery and repeated submission under the agreed duplicate-prevention behaviour.

A useful release recommendation leaves the team with a clear statement of tested behaviour, unresolved risk and the conditions under which proceeding is acceptable. It connects the defect to its real consequences.
