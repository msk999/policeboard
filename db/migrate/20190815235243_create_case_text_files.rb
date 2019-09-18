class CreateCaseTextFiles < ActiveRecord::Migration
  def up
    create_table :case_text_files do |t|
      t.references :case
      t.string :name
      t.text :search_text

      t.timestamps null: false
    end

    execute <<-SQL
      CREATE INDEX case_text_files_search_idx
      ON case_text_files
      USING gin(to_tsvector('english', search_text));
    SQL
  end

  def down
    execute <<-SQL
      DROP INDEX
      IF EXISTS case_text_files_search_idx;
    SQL

    drop_table(:case_text_files, if_exists: true)
  end
end
