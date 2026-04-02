FROM mysql:8.0

LABEL maintainer="themarcos" \
      description="MedApp - MySQL Database" \
      version="1.0.0"

# Copy init file to corresponding folder inside image
COPY database/mysql/init.sql /docker-entrypoint-initdb.d/

# Expose port 
EXPOSE 3306