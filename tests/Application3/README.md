# Sulu 3.0 Test Application

Minimal test application for verifying the `akawaka/sulu-multi-ckeditor-bundle` 
with **Sulu 3.0** (Doctrine ORM-based content, no PHPCR).

## Key Differences from Application/ (Sulu 2.x)

- **No PHPCR**: `DoctrinePHPCRBundle`, `SuluDocumentManagerBundle`, 
  `PhpcrMigrationsBundle` are removed
- **No CmfRoutingBundle**: Routing is handled differently in Sulu 3.0
- **Doctrine ORM only**: Content is stored in `DimensionContent` tables (JSON `templateData`)
- **No `MassiveBuildBundle`**: Build system has been reworked

## What This Tests

In Sulu 3.0, the bundle's PHP content type (`MultiTextEditorType extends TextEditor`) 
is **not loaded** because `TextEditor` no longer exists. The conditional loading in 
`MultiEditorExtension::load()` handles this automatically.

Only the following are active in Sulu 3.0:
- `MultiEditorAdmin` - provides editor configurations to the JS frontend
- JS admin components (CKEditor5 field adapter, field type, components)
- XML templates using `type="configurable_text_editor"`

## Status

**Placeholder** - This test app will be fully functional once Sulu 3.0 is released.
The `composer.json` requires `sulu/sulu: ^3.0@dev`.
