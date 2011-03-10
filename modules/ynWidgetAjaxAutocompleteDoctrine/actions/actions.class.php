<?php

/**
 * ajax actions.
 * 
 * @package    ynWidgetAjaxAutocompletePlugin
 * @subpackage ajax
 * @author     Your name here
 * @version    SVN: $Id: actions.class.php 12534 2008-11-01 13:38:27Z Kris.Wallsmith $
 */
class ynWidgetAjaxAutocompleteDoctrineActions extends BaseYnWidgetAjaxActions
{
  protected function doRetrieve( $table_name, $term, $limit, array $not )
  {
    $this->getResponse()->setContentType('application/json; charset=utf-8');

    $table = Doctrine::getTable( $table_name );

    if ( ! $table instanceof ynWidgetAjaxTable ) {
      $msg = "Table $table_name must implement ynWidgetAjaxTable";
      throw new Exception( $msg );
    }

    $objects = $table->retrieveForYnAjax( $term, $limit, $not );

    $ajax_array = array();

    foreach ( $objects as $object ) {
      $ajax_array[] = array(
        'id' => $object->getId(), 'value' => (string) $object
      );
    }

    return $ajax_array;
  }
}
