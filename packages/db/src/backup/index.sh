export $(grep -v '^#' .env | xargs)

BACKUP_FILE_NAME="$(date +%Y%m%d | tr -d '-')"

# Remove `pgbouncer=true` from the database URL
STAGING_DB_URL=$(echo $STAGING_READONLY_STRING | sed "s/[?&]pgbouncer=true//")
PRODUCTION_DB_URL=$(echo $PRODUCTION_READONLY_STRING | sed "s/[?&]pgbouncer=true//")



if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI not installed. Install it and configure credentials."
  exit 1
fi

# Run pg_dump to create the backup
echo "Using database URL: $STAGING_READONLY_STRING"
pg_dump --dbname="$STAGING_DB_URL" | aws s3 cp - s3://squared-staging-backup/$BACKUP_FILE_NAME.bak --region ap-southeast-2
echo "Using database URL: $PRODUCTION_READONLY_STRING"
pg_dump --dbname="$PRODUCTION_DB_URL" | aws s3 cp - s3://squared-prod-backup/$BACKUP_FILE_NAME.bak --region us-east-1
