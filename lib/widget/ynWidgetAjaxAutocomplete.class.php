<?php
class ynWidgetAjaxAutocomplete extends sfWidgetForm
{
  protected function configure($options = array(), $attributes = array())
  {
    parent::configure( $options, $attributes );

    $theme_css = '/ynWidgetAjaxAutocompletePlugin/css/smoothness'
                 . '/jquery-ui-1.8.9.custom.css';

    $jqueryui_js = '/ynWidgetAjaxAutocompletePlugin/js'
                 . '/jquery-ui-1.8.9.custom.min.js';

    $this->addRequiredOption( 'source' );
    $this->addRequiredOption( 'noscript_widget' );
    $this->addOption( 'theme_css', $theme_css );
    $this->addOption( 'jqueryui_js', $jqueryui_js );
    $this->addOption( 'autocomplete_options', array() );
    $this->addOption( 'default', array() );
    $this->addOption( 'item_route', null );
    $this->addOption( 'aux_url', null );
    $this->addOption( 'aux_link_text', 'Create new' );
  }

  public function render(
    $name, $value = null, $attributes = array(), $errors = array()
  ) {
    $id = $this->generateId( $name );

    $ret = '';

    $ret .= $this->getOption('noscript_widget')
            ->render( $name, $value,
              array_merge($this->attributes, $attributes), $errors );

    $metadata = array(
      'source'        => $this->getOption('source'),
      'item_route'    => $this->getOption('item_route'),
      'options'       => $this->getOption('autocomplete_options'),
      'attributes'    => array_merge( $this->attributes, $attributes ),
    );

    $meta_span_attrib = array(
      'class' => 'ynWidgetAutocomplete-meta',
      'title' => json_encode( $metadata ),
    );

    $ret .= $this->el( 'span', '', $meta_span_attrib );

    if ( $this->getOption('aux_url') && $this->getOption('aux_link_text') ) {
      $a_attrib = array(
        'href'   => $this->getOption('aux_url'),
        'class'  => 'yn-autocomplete-aux-link',
        'target' => '_blank',
      );

      $ret .= $this->el( 'a', $this->getOption('aux_link_text'), $a_attrib );
    }
    
    return $ret;
  }

  public function getStylesheets()
  {
    return array(
      $this->getOption('theme_css') => 'all',
      '/ynWidgetAjaxAutocompletePlugin/css/autocomplete.css' => 'all',
    );
  }

  public function getJavascripts()
  {
    if ( $jqueryui_js = $this->getOption('jqueryui_js') ) {
      return array(
        $jqueryui_js,
        '/ynWidgetAjaxAutocompletePlugin/js/autocomplete.js',
      );
    }
    else {
      return array(
        '/ynWidgetAjaxAutocompletePlugin/js/autocomplete.js',
      );
    }
  }

  /**
   * Returns the string representing an HTML element
   *
   * @param string $tag The HTML tag to use
   * @param string $contents The contents of the element (like Javascript's innerHTML)
   * @param array $attribs
   * @return string
   */
  protected function el( $tag, $contents, $attribs = array() )
  {
    $attrib_string = '';

    foreach ( $attribs as $key => $value ) {
      $attrib_string .= $key . '="' . htmlentities($value) . '" ';
    }

    return "<$tag $attrib_string>$contents</$tag>";
  }
}
