# export $(grep -v '^#' .env | xargs)

BACKUP_FILE_NAME="$(date +%Y%m%d | tr -d '-')"

DATABASE_URL=$1
AWS_BUCKET_NAME=$2

# Remove `pgbouncer=true` from the database URL
CLEAN_DB_URL=$(echo $DATABASE_URL | sed "s/[?&]pgbouncer=true//")



if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI not installed. Install it and configure credentials."
  exit 1
fi

# Run pg_dump to create the backup
echo "Using database URL: $DATABASE_URL"
echo "Using AWS bucket: $AWS_BUCKET_NAME"
pg_dump --dbname="$CLEAN_DB_URL" | aws s3 cp - s3://$AWS_BUCKET_NAME/$BACKUP_FILE_NAME.bak --region us-east-1
