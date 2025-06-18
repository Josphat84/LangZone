# Use official Python base image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
 && apt-get install -y netcat-openbsd gcc libpq-dev curl \
 && rm -rf /var/lib/apt/lists/*


# Install PostgreSQL client separately (optional)
RUN apt-get update && apt-get install -y postgresql-client

# Install Python dependencies
COPY clean_requirements.txt requirements.txt
RUN pip install -r requirements.txt


# Copy project files into the container
COPY . .

# Start Django app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
