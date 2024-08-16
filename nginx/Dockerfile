# Use the official Nginx image as the base image
FROM nginx:latest

# Install envsubst for variable substitution
RUN apt-get update && apt-get install -y gettext-base

# Copy the template nginx.conf
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy the script to replace environment variables
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start the container by replacing variables and running Nginx
CMD ["/start.sh"]
