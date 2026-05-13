#!/usr/bin/env bash
# Firebase App Hosting deploy script (Blaze plan required)
# Çalıştırmadan önce: firebase login && billing etkinleştir

set -e

PROJECT="tk-helpdesk"
REGION="europe-west1"

echo "=== Firebase App Hosting secrets yükleniyor ==="

SA_KEY=$(grep FIREBASE_SERVICE_ACCOUNT_KEY .env.local | cut -d'=' -f2-)

echo "$SA_KEY" | firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_KEY \
  --project "$PROJECT" --non-interactive 2>/dev/null || \
  printf '%s' "$SA_KEY" | firebase apphosting:secrets:set FIREBASE_SERVICE_ACCOUNT_KEY --project "$PROJECT"

echo "tk-helpdesk.firebasestorage.app" | firebase apphosting:secrets:set FIREBASE_STORAGE_BUCKET \
  --project "$PROJECT"

echo "=== App Hosting backend oluşturuluyor ==="
firebase apphosting:backends:create \
  --project "$PROJECT" \
  --location "$REGION" \
  --app-id "1:916968245700:web:655a7727648c8e763e3c91" \
  --service-account "firebase-adminsdk-fbsvc@${PROJECT}.iam.gserviceaccount.com"

echo ""
echo "=== CORS yapılandırılıyor ==="
gcloud storage buckets update gs://tk-helpdesk.firebasestorage.app \
  --cors-file=cors.json --project="$PROJECT" 2>/dev/null || \
  echo "CORS: gcloud ile yapılandırın (opsiyonel)"

echo ""
echo "✅ Backend oluşturuldu. Firebase Console → App Hosting → deploy takip edin."
echo "   https://console.firebase.google.com/project/tk-helpdesk/apphosting"
