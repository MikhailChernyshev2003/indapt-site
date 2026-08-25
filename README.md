# INDAPT

---

## Clean install a project

```bash
pnpm install --frozen-lockfile
```

## Install a package

```bash
pnpm add <package>
```

## Run a security audit

```bash
pnpm audit [--fix]
```

## Check for outdated packages

```bash
pnpm outdated
```

## Update packages

```bash
pnpm up
```

## node version manager

- https://volta.sh/

## volta set or install version node

```bash
volta install node@22.16.0
# or
volta install node@22
# or latest
volta install node
```

## volta pin project

```bash
volta pin node@22.16.0
# or
volta pin node@22
```

## development server

```bash
pnpm run dev
```

## production

```bash
pnpm run build # SSR
# or
pnpm run generate # SSG
```

## locally preview production build:

```bash
pnpm run preview
```
