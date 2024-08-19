# Use the official Nginx image as the base image
FROM nginx:stable-alpine

# Install envsubst for variable substitution
RUN apk add --no-cache gettext

# Copy the template nginx.conf
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy the script to replace environment variables
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start the container by replacing variables and running Nginx
CMD ["./start.sh"]
