# KAIROSEED × AURORA — First System Layer

**Status: Public research review candidate. Production authorization: NO.**

This is an intentionally small **browser-only governance simulation**, not a secure gate, a real autonomous agent or a third-party certified system. The public webpage has no API keys, model APIs, external network requests, database, saved data, payments, or connected tools. Refresh to reset the state.

## Research question

Can language-model agents propose useful work while remaining outside the authority that permits consequential action?

## Teaching pipeline

Human-operated demo → Model A / Model B **fixture labels** → GOVANA-style deterministic argument validation → GAT **simulated** one-minute, single-use grant → PEP gate → JIREH-style in-memory state change → receipt list → STRANGER-like replay **in the same browser**.

The demo can issue its own local fake grants; no real human authentication, signature verification or trusted model caller identity exists. It does not constitute an enforcement boundary: a user controlling browser JavaScript can bypass it, fabricate grants, alter state and rewrite evidence.

## Try locally

From repository root, with Node.js 18+ and Python 3 installed:

```sh
node --test lab/test-governance.mjs
python3 -m http.server 8000
```

Open http://localhost:8000/lab/ . No npm installation or credentials required. `file://` module loading may be blocked by your browser.

## Scope of the test suite

The Node test file checks a finite fixture matrix: deny without permit, bound to actor/arguments, expired permit, replay, malformed inputs, fake-credit overspend, valid synthetic transitions, and altered/missing evidence. Test outcomes must be recorded when independently run; writing tests does not imply CI or third-party acceptance.

## What is **not** implemented

- Live Qwen, ChatGPT, Claude, Gemini or other frontier model inference.
- Human authentication, Ed25519 grant signatures, managed signing keys, delegation broker, trusted OS process boundary or a protected server-side PEP.
- External tools, filesystem persistence, remote execution, trusted ledger anchoring, independent operator custody, crash recovery or production deployment approval.

## Existing portfolio deployment hold

Historical GitHub Actions run [#40223821804](https://github.com/SangmuanValte/sangmuan-portfolio-/actions/runs/40223821804) failed before a runner step was recorded. Its Pages configuration and error annotation remain unverified. This research branch does **not** alter `.github/workflows/deploy-pages.yml`, repository Actions permissions, Pages settings or rerun any workflow. Do not merge for automatic public Pages deployment until the failure is diagnosed.

## Next milestone

An independently operated reviewer should audit the exact implementation and create a **separate backend service** that authenticates model callers and human approvers, mediates the sole protected effect path, atomically consumes signed scoped permits, produces externally anchored evidence and proves in adversarial tests that no unauthorized effects occur within the specified trust boundary.

**Claim ≤ Evidence ≤ Established Scope. Capability ≠ Permission. Model Proposal ≠ Human Approval.**