<?php
interface ynWidgetAjaxTable
{
  /**
   * @param string $term
   * @param int $limit
   * @param array int[] $not
   * @return Doctrine_Collection
   */
  public function retrieveForYnAjax( $term, $limit, array $not );
}
