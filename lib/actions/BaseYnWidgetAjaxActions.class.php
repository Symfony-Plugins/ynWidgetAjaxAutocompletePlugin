<?php

/**
 * ajax actions.
 *
 * @package    ynWidgetAjaxAutocompletePlugin
 * @subpackage ajax
 * @author     Your name here
 * @version    SVN: $Id: actions.class.php 12534 2008-11-01 13:38:27Z Kris.Wallsmith $
 */
abstract class BaseYnWidgetAjaxActions extends sfActions
{
  public function executeRetrieve( sfWebRequest $request )
  {
    $this->forward404Unless( $table_name = $request->getParameter('table') );

    $this->getResponse()->setContentType('application/json');

    if ( $request->getParameter('limit') ) {
      $limit = $request->getParameter('limit');
    }
    else {
      $limit = 10;
    }

    if ( $not = $request->getParameter('not') ) {
      $not = explode( ',', $not );
    }
    else {
      $not = array();
    }

    $result = $this->doRetrieve( $table_name, $request->getParameter('term'), $limit, $not );

    return $this->renderText( json_encode( $result ) );
  }

  /**
   * @param string $table_name
   * @param string $term
   * @param int $limit
   * @param array int[] $not
   * @return array
   */
  abstract protected function doRetrieve( $table_name, $term, $limit, array $not );
}