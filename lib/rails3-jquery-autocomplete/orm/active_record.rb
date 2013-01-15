module Rails3JQueryAutocomplete
  module Orm
    module ActiveRecord
      def get_autocomplete_order(method, options, model=nil)
        order = options[:order]

        table_prefix = model ? "#{model.table_name}." : ""
        order || "#{table_prefix}#{method.first} ASC"
      end

      def get_autocomplete_items(parameters)
        model   = parameters[:model]
        term    = parameters[:term]
        method  = Array(parameters[:method])
        options = parameters[:options]
        scopes  = Array(options[:scopes])
        limit   = get_autocomplete_limit(options)
        order   = get_autocomplete_order(method, options, model)

        
        terms = term.split('\\s+')
        #method == columns
        #term == search term
        
        items = model.scoped

        scopes.each { |scope| items = items.send(scope) } unless scopes.empty?

        items = items.select(get_autocomplete_select_clause(model, method, options)) unless options[:full_model]
            
        terms.each do |term|
          temp_items = items.where(get_autocomplete_where_clause(model, term, method, options)).
              limit(limit).order(order)          
          items = items.empty? ? temp_items : items & temp_items
        end

        #old way
        # items = items.where(get_autocomplete_where_clause(model, term, method, options)).
        #     limit(limit).order(order)


      end

      def get_autocomplete_select_clause(model, method, options)
        table_name = model.table_name
        (["#{table_name}.#{model.primary_key}", "#{table_name}.#{method.first}"] + (options[:extra_data].blank? ? [] : options[:extra_data]))
      end

      def get_autocomplete_where_clause(model, term, method, options)
        table_name = model.table_name
        is_full_search = options[:full]
        like_clause = (postgres? ? 'ILIKE' : 'LIKE')
        
        
        rep = [method.map{|m| "LOWER(#{table_name}.#{m}) #{like_clause} ? " }.join('or ')]
        method.map{|m|
          rep << "#{(is_full_search ? '%' : '')}#{term.downcase}%"
        }
        
        rep
        
        
      end

      def postgres?
        defined?(PGconn)
      end
    end
  end
end
