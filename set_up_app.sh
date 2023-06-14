pip install -r backend/requirements.txt
npx kill-port 3000
npx kill-port 5000
npx kill-port 8080
python backend/app.py &

cd backend/app
npx http-server ./ --cors -c-1 -s &
npm install papaparse
npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
npx yarn install
npx yarn start
echo > logs.txt
if [ -f $"script.py" ]; then rm script.py; fi
