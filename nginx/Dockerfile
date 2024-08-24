# Use the official Nginx image as the base image
FROM nginx:stable-alpine

# Install envsubst for variable substitution
RUN apk add --no-cache gettext

# Copy the template nginx.conf
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Replace environment variables in the template and output to the final nginx.conf
RUN envsubst '${DOMAIN}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
