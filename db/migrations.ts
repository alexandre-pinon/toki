interface Migration {
	version: number;
	sql: string;
}

export const migrations: Migration[] = [
	{
		version: 1,
		sql: `
      CREATE TABLE IF NOT EXISTS shopping_list_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity FLOAT,
        unit TEXT CHECK(unit IN ('g', 'kg', 'l', 'cl', 'ml', 'tsp', 'tbsp', 'cup', 'piece', 'pinch', 'bunch', 'clove', 'can', 'package', 'slice', 'totaste')),
        category TEXT NOT NULL DEFAULT 'Autre'
        CHECK(category IN ('Fruits & Légumes', 'Viande', 'Poisson', 'Épices & Condiments', 'Céréales', 'Produits laitiers', 'Dessert', 'Œufs & Produits frais', 'Autre')),
        checked BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `,
	},
	// Future migrations go here
];
