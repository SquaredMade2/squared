export $(grep -v '^#' .env | xargs)

BACKUP_FILE_NAME="$(date +%Y-%m-%d | tr -d '-')"

# Remove `pgbouncer=true` from the database URL
CLEAN_DB_URL=$(echo $REMOTE_DATABASE_URL | sed "s/[?&]pgbouncer=true//")


echo "Using database URL: $REMOTE_DATABASE_URL"

# Run pg_dump to create the backup

pg_dump --dbname="$CLEAN_DB_URL" | aws s3 cp - s3://squared-staging-backup/$BACKUP_FILE_NAME.bak --region us-east-1

if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI not installed. Install it and configure credentials."
  exit 1
fi

echo "🗑️ Emptying S3 bucket before upload..."