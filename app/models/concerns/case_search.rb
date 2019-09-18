module CaseSearch
  include FullText

  SEARCH_CATEGORIES = [
    ["Case #", 0],
    ["Defendant Last Name", 1],
    ["Badge/Employee #", 2],
    ["Keyword",3],
  ].freeze

  def search(keyword, category)
    category_id = category.to_i
    filtering_clause = filter_clause(category_id)
    scope = case_scope(keyword, category_id)
    scope
      .joins(:defendant)
      .where(is_active:true)
      .where.not(defendant_id: nil)
      .where(filtering_clause,
        { keyword: '%' + keyword.downcase + '%' })
      .select('cases.*, defendants.*')
  end

  private

  def case_scope(keyword, category)
    text_search = SEARCH_CATEGORIES[category].first == 'Keyword'
    return Case.all unless text_search

    text_search(keyword)
  end

  def filter_clause(category_id)
    case category_id
    when 0
      "LOWER(cases.number) LIKE :keyword "
    when 1
      "LOWER(defendants.first_name) LIKE :keyword " +
        "OR LOWER(defendants.last_name) LIKE :keyword " +
        "OR LOWER(defendants.first_name||' '||defendants.last_name) LIKE :keyword "
    when 2
      "LOWER(defendants.number) LIKE :keyword"
    when 3
      ''
    end
  end
end