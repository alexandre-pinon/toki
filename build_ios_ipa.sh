#!/bin/bash

# CONFIGURATION
EXPORT_METHOD="development"  # or 'ad-hoc', 'app-store', etc.
EXPORT_PATH="./ios/build/$SCHEME.ipa"
EXPORT_OPTIONS_PLIST="./ios/ExportOptions.plist"

# 1. Find latest .xcarchive
LATEST_ARCHIVE=$(find ~/Library/Developer/Xcode/Archives/ -type d -name "*.xcarchive" -print0 | xargs -0 ls -td | head -n 1)

if [ -z "$LATEST_ARCHIVE" ]; then
  echo "❌ No archive found."
  exit 1
fi

echo "📦 Using archive: $LATEST_ARCHIVE"

# 2. Create ExportOptions.plist
cat > "$EXPORT_OPTIONS_PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>$EXPORT_METHOD</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>compileBitcode</key>
    <false/>
    <key>destination</key>
    <string>export</string>
</dict>
</plist>
EOF

# 3. Export the IPA
echo "🚀 Exporting IPA..."
xcodebuild -exportArchive \
           -archivePath "$LATEST_ARCHIVE" \
           -exportPath "$EXPORT_PATH" \
           -exportOptionsPlist "$EXPORT_OPTIONS_PLIST" \
           -allowProvisioningUpdates

echo "✅ IPA exported to: $EXPORT_PATH"

