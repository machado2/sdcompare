FROM node
WORKDIR /app
COPY ui .
RUN npm install
RUN npm run build

FROM python:3
WORKDIR /app
COPY backend backend
COPY --from=0 /app/build /app/ui/build
WORKDIR /app/backend
RUN pip3 install -r requirements.txt
EXPOSE 5000
CMD ["python3", "main.py"]
