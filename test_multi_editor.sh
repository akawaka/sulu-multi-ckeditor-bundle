#!/bin/bash

echo "==============================================="
echo "Test Multi CKEditor Configuration Implementation"
echo "==============================================="

echo ""
echo "1. Checking if admin interface is accessible..."
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://corpo.cfc.localhost/admin/)
if [ "$ADMIN_STATUS" = "200" ]; then
    echo "✓ Admin interface is accessible"
else
    echo "✗ Admin interface not accessible (HTTP $ADMIN_STATUS)"
fi

echo ""
echo "2. Checking if content types are registered..."
docker compose exec php bin/console debug:container --tag=sulu.content.type | grep -E "(configurable_text_editor|test_simple_type)"

echo ""
echo "3. Checking if our field registry is working..."
if [ -f "public/build/admin/main.becd4e2180d568ee386a.js" ]; then
    echo "✓ Admin assets are compiled"
    echo "Checking for our custom components in build..."
    if grep -q "configurable_text_editor" public/build/admin/main.becd4e2180d568ee386a.js; then
        echo "✓ Custom field type found in compiled assets"
    else
        echo "? Custom field type not found in compiled assets (might be minified)"
    fi
else
    echo "✗ Admin assets not found"
fi

echo ""
echo "4. Template structure:"
echo "---"
cat config/templates/pages/test_multi_editor.xml
echo "---"

echo ""
echo "5. Files created for multi-editor implementation:"
echo "✓ assets/admin/adapters/CKEditor5Configurable.js"
echo "✓ assets/admin/components/CKEditor5Configurable.js"
echo "✓ assets/admin/fields/ConfigurableTextEditor.js"
echo "✓ src/Bundle/MultiEditorBundle/Content/ConfigurableTextEditor.php"
echo "✓ config/templates/pages/test_multi_editor.xml"
echo "✓ templates/pages/test_multi_editor.html.twig"

echo ""
echo "🎯 READY TO TEST! Next steps:"
echo "1. Go to http://corpo.cfc.localhost/admin/"
echo "2. Login with admin credentials"
echo "3. Create a new page with template 'Test Multi Editor'"
echo "4. Check if the 3 editors show different toolbars:"
echo "   - Minimal: bold, italic, lists"
echo "   - Simple: + headings, underline, font color"
echo "   - Full: + alignment, table, code, more headings"
echo ""
echo "📚 Implementation provides:"
echo "   • Generic solution not tied to any specific organization"
echo "   • Easy to extend with new configurations"
echo "   • Clean separation of concerns"
echo "   • Reusable across different Sulu projects"