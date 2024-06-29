FROM node
WORKDIR /app
COPY ui .
RUN npm install
RUN npm run build

FROM python:3
WORKDIR /app
COPY backend .
COPY --from=0 /app/build /app/ui
RUN pip3 install -r requirements.txt
CMD ["python3", "app.py"]
