BEGIN;

TRUNCATE TABLE product_raw_materials, products, raw_materials RESTART IDENTITY CASCADE;

INSERT INTO products (code, name, price)
VALUES
  ('PRD-001', 'Premium Widget', 500.00),
  ('PRD-002', 'Standard Widget', 220.00),
  ('PRD-003', 'Budget Widget', 120.00),
  ('PRD-004', 'Deluxe Gadget', 350.00),
  ('PRD-005', 'Basic Gadget', 160.00);

INSERT INTO raw_materials (code, name, stock_quantity)
VALUES
  ('RM-001', 'Steel', 100.0000),
  ('RM-002', 'Plastic', 50.0000),
  ('RM-003', 'Lithium', 5.0000),
  ('RM-004', 'Copper', 30.0000),
  ('RM-005', 'Rubber', 40.0000),
  ('RM-006', 'Glass', 25.0000);

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES
  ((SELECT id FROM products WHERE code = 'PRD-001'), (SELECT id FROM raw_materials WHERE code = 'RM-001'), 20.0000),
  ((SELECT id FROM products WHERE code = 'PRD-001'), (SELECT id FROM raw_materials WHERE code = 'RM-003'), 2.0000),

  ((SELECT id FROM products WHERE code = 'PRD-004'), (SELECT id FROM raw_materials WHERE code = 'RM-001'), 15.0000),
  ((SELECT id FROM products WHERE code = 'PRD-004'), (SELECT id FROM raw_materials WHERE code = 'RM-003'), 3.0000),

  ((SELECT id FROM products WHERE code = 'PRD-002'), (SELECT id FROM raw_materials WHERE code = 'RM-001'), 10.0000),
  ((SELECT id FROM products WHERE code = 'PRD-002'), (SELECT id FROM raw_materials WHERE code = 'RM-002'), 10.0000),

  ((SELECT id FROM products WHERE code = 'PRD-005'), (SELECT id FROM raw_materials WHERE code = 'RM-002'), 8.0000),

  ((SELECT id FROM products WHERE code = 'PRD-003'), (SELECT id FROM raw_materials WHERE code = 'RM-001'), 5.0000);

COMMIT;
