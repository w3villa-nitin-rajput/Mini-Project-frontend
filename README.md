# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

===============================================================================================================================

1. Signup Process
1.1 Social Signup (Account Merge)
● Requirement: Implement the ability for users to sign up using their social media
accounts (e.g., Facebook, Google).
● Functionality: If an account with the same email already exists, the system should
merge the social media account with the existing account.
● Expected Behavior: Users should be able to seamlessly create an account or merge
with an existing one using their social media credentials.
● Acceptance Criteria:
○ Users can sign up using at least two social media platforms.
○ If an email already exists, the accounts are merged without data loss.
○ Users are redirected to the dashboard after successful signup.

1.2 Standard Signup
● Requirement: Allow users to sign up by providing their email address and creating a
password.
● Functionality: Upon successful signup, the system should send a confirmation email to
the user.
● Expected Behavior: Users receive a confirmation email and must confirm their email
address to activate their account.
● Acceptance Criteria:
○ Users can sign up with an email and password.
○ Confirmation email is sent to the registered email address.
○ Users can confirm their email and activate their account by clicking the link in the
email.
