# Treeify

## How to run this

```bash
// clone repo
yarn install
yarn jest
```

## Errors

### Error: ENOSPC: System limit for number of file watchers reached
Solution
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
