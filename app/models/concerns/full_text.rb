module FullText
  def text_search(keywords)
    query = build_query(keywords)
    result = ActiveRecord::Base.connection.execute(query)
    byebug
    result
  end

  private

  def build_query(keywords)
    @ts_queries = keywords_to_tsquery(keywords.split(' '))

    query =
    "#{select_fields} "\
    "#{where_clause} "\
    "GROUP BY cases.id ON ts.id = cases.id "
    query
  end

  def select_fields
    'SELECT id, '\
      "ts_headline('english', search_text, "\
      "#{keywords_to_query}"\
      ", 'StartSel = <, StopSel = >, MinWords=1, MaxWords=10, MaxFragments=1,ShortWord=2') as search_text "\
      "FROM "\
      "(SELECT cases.id, string_agg(ctf.search_text::text, ' ') as search_text "\
        "FROM cases INNER JOIN case_text_files ctf ON cases.id = ctf.case_id "\
  end

  def keywords_to_tsquery(keywords_array)
    ts_query = []
    keywords_array.each do |term|
      ts_query << "to_tsquery('english', ''' ' || '#{term}' || ' ''' || ':*') "
    end
    ts_query
  end

  def where_clause
    to_query = StringIO.new
    to_query << "WHERE ( "
    @ts_queries.each do |term|
      to_query << "#{field_to_vector} @@ #{term}"
      to_query << "AND " if term != @ts_queries.last
    end
    to_query << ") "
    to_query.string
  end

  def keywords_to_query
    to_query = StringIO.new
    to_query << "("
    @ts_queries.each do |term|
      to_query << "#{term}"
      to_query << "|| " if term != @ts_queries.last
    end
    to_query << ") "
    to_query.string
  end

  def field_to_vector
    "(to_tsvector('english', coalesce(search_text,'')) )"
  end
end