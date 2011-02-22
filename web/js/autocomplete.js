function YNAutocompleteInput( meta_span )
{
  select       = $(meta_span).siblings('select').get(0);
  this.base_id = select.id;
  this.name    = select.name;
  this.state   = [];

  this.edit_button   = null;
  this.delete_button = null;

  $(select).remove();

  this.container = $(meta_span).parent();
  this.metadata  = $.parseJSON( meta_span.title );
}

YNAutocompleteInput.prototype.init = function()
{
  this.input           = document.createElement( 'input' );
  this.input.id        = this.base_id + '_autocomplete';
  this.input.className = 'yn-autocomplete';

  for ( key in this.metadata.initial_value ) {
    this.state.push( key );
  }

  if ( ! this.metadata.multiple ) {
    this.edit_button           = document.createElement( 'span' );
    this.edit_button.id        = this.base_id + '_edit';
    this.edit_button.title     = 'Edit';
    this.edit_button.className = 'ui-icon ui-icon-pencil yn-autocomplete-edit-button';

    $(this.edit_button).prependTo( this.container )
                       .click( yn_autocomplete_single_redirect( this ) );

    this.delete_button           = document.createElement( 'span' );
    this.delete_button.id        = this.base_id + '_delete';
    this.delete_button.title     = 'Clear';
    this.delete_button.className = 'ui-icon ui-icon-close yn-autocomplete-delete-button';

    $(this.delete_button).prependTo( this.container )
                         .click( yn_autocomplete_single_clear( this ) );

    this.update_single_buttons();
  }

  $(this.input).prependTo( this.container );

  options = {
    source:    this.metadata.source,
    delay:     500,
    minLength: 3
  };

  // merge default options with provided options
  $.extend( options, this.metadata.options );

  if ( this.metadata.multiple ) {
    this.init_ul();

    options.select = yn_autocomplete_multiple_select( this );
    options.close  = function( e, ui ) {e.target.value = ''};

    $(this.input).autocomplete( options );
  }
  else {
    options.select = yn_autocomplete_single_select( this );
    options.change = yn_autocomplete_single_change( this );

    $(this.input).autocomplete( options )
                 .addClass('yn-autocomplete-single')
                 .focus( function() {this.value = '';} );

    this.input.value = this.metadata.initial_value[ this.state[0] ];
    this.input.last_known_value = this.input.value;
    
    clear = document.createElement( 'div' );
    clear.className = 'yn-autocomplete-clear';
    $(clear).appendTo( this.container );
  }

  $($(this.input).parents('form').get(0))
    .submit( yn_autocomplete_form_preprocess( this ) );
}

YNAutocompleteInput.prototype.init_ul = function() {
  this.ul           = document.createElement('ul');
  this.ul.id        = this.base_id + '_items';
  this.ul.className = 'yn-autocomplete-selected-list';

  $(this.ul).appendTo( this.container );

  for ( key in this.metadata.initial_value ) {
    this.add_li( key, this.metadata.initial_value[ key ], false );
  }
}

YNAutocompleteInput.prototype.add_li = function( key, value, animate ) {
  c_span = document.createElement('span');
  c_span.className = 'ui-icon ui-icon-close';

  b_div = document.createElement('div');
  b_div.className = 'ui-state-default ui-corner-all ';
  b_div.id = this.ul.id + '_' + key + '_remove';
  b_div.appendChild( c_span );

  $(b_div).click( yn_autocomplete_item_click( this, key ) );

  a_li = document.createElement('li');
  a_li.id = this.ul.id + '_' + key;
  a_li.appendChild( b_div );
  
  text = document.createTextNode( value );

  if ( this.metadata.item_url ) {
    // symfony url_for() function doesn't work with normal tokens
    url = this.metadata.item_url.replace( '9999999999', key );
    link = document.createElement( 'a' );
    link.href = url;
    link.appendChild( text );
    a_li.appendChild( link );
  }
  else {
    a_li.appendChild( text );
  }

  if ( animate ) {
    $( a_li ).hide()
      .appendTo( this.ul )
      .slideDown();
  }
  else {
    $( a_li ).appendTo( this.ul );
  }
}

YNAutocompleteInput.prototype.update_single_buttons = function() {
  if ( this.state[0] ) {
    // symfony url_for() function doesn't work with normal tokens
    $(this.edit_button).show();
    $(this.delete_button).show();
    $(this.input).addClass('yn-autocomplete-buttons');
  }
  else {
    $(this.edit_button).hide();
    $(this.delete_button).hide();
    $(this.input).removeClass('yn-autocomplete-buttons');
  }
}

function yn_autocomplete_multiple_select( input_obj )
{
  return function( e, ui ) {
    input_obj.state.push( ui.item.id );
    input_obj.add_li( ui.item.id, ui.item.value, true );
  };
}

function yn_autocomplete_multiple_remove( input_obj )
{
  return function() {
    foreign_id_matches = this.id.match(/(\d+)_remove/);
    // input_obj.ajax( 'remove', foreign_id_matches[1] );
    $(this).parent().slideUp( 'normal', function() {
      $(this).remove();
    });
  }
}

function yn_autocomplete_single_select( input_obj )
{
  return function( e, ui ) {
    if ( ui.item !== null ) {
      input_obj.state = [];
      input_obj.state.push( ui.item.id );
      input_obj.input.last_known_value = ui.item.value;
      input_obj.update_single_buttons();
    }
  };
}

function yn_autocomplete_single_change( input_obj )
{
  return function( e, ui ) {
    if ( ui.item === null ) {
      // nothing selected; reset to last known value
      e.target.value = e.target.last_known_value;
    }
  };
}

function yn_autocomplete_single_clear( input_obj ) {
  return function() {
    input_obj.state = [];
    input_obj.input.value = '';
    input_obj.input.last_known_value = '';
    input_obj.update_single_buttons();
  }
}

function yn_autocomplete_item_click( input_obj, key )
{
  return function() {
    // input_obj.ajax( 'remove', item.id );
    // input_obj.state_remove( key );
    i = input_obj.state.indexOf( key );

    if ( i != -1 ) {
      input_obj.state.splice( i, 1 );
    }

    $(this).parent().slideUp( 'normal', function() {
      $(this).remove();
    });
  };
}

function yn_autocomplete_form_preprocess( input_obj )
{
  return function() {
    if ( input_obj.metadata.multiple ) {
      for ( key in input_obj.state ) {
        input       = document.createElement( 'input' );
        input.name  = input_obj.name;
        input.type  = 'hidden';
        input.value = input_obj.state[ key ];

        $(input).appendTo( input_obj.container );
      }
    }
    else if ( input_obj.state[ 0 ] ) {
      input       = document.createElement( 'input' );
      input.name  = input_obj.name;
      input.type  = 'hidden';
      input.value = input_obj.state[ 0 ];

      $(input).appendTo( input_obj.container );
    }

    return true;
  }
}

function yn_autocomplete_single_redirect( input_obj )
{
  return function() {
    if ( input_obj.state[ 0 ] ) {
      url = input_obj.metadata.item_url.replace( '9999999999', input_obj.state[0] );
      window.open( url );
    }
  }
}

$( function() {
  $.ajaxSetup( {timeout: 3000} );

  $('.ynWidgetAutocomplete-meta').each( function() {
    input = new YNAutocompleteInput( this );
    input.init();
  });
});
