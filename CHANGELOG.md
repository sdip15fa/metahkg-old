# Changelog

This changelog records changes after v0.5.1.

## v0.5.2dev

- use boolean instead of male/female to store sex
- please migrate your database before upgrading :

```bash
node server/migrate/migratetov0.5.2.js
```

## v0.5.2dev1

- patch profile not being able to display sex
