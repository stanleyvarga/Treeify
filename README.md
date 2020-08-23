# Treeify

## Installing dependencies
```bash
# install all dependencies
cd Treeify && yarn install

# run tests to see everything is working
# Tests are being run only from src/
yarn test
```

## Building
This will create dist/ file, where files are compiled using babel
```bash
yarn build
```

## Common Errors
### Error: ENOSPC: System limit for number of file watchers reached
Solution
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
