#!/bin/sh
git remote add heroku https://git.heroku.com/warm-springs-40429.git
wget https://cli-assets.heroku.com/branches/stable/heroku-linux-amd64.tar.gz
tar -xzf heroku-linux-amd64.tar.gz
mkdir -p /usr/local/lib /usr/local/bin
sudo mv heroku /usr/local/lib
sudo ln -s /usr/local/lib/heroku/bin/heroku /usr/local/bin/heroku
 
cat > ~/.netrc << EOF
machine api.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_API_KEY
machine git.heroku.com
  login $HEROKU_LOGIN
  password $HEROKU_API_KEY
EOF

# Add heroku.com to the list of known hosts
ssh-keyscan heroku.com >> ~/.ssh/known_hosts
