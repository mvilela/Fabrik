<?php
/**
 * Main Fabrik administrator controller
 *
 * @package     Joomla.Administrator
 * @subpackage  Fabrik
 * @copyright   Copyright (C) 2005 Rob Clayburn. All rights reserved.
 * @license     http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 */

// No direct access
defined('_JEXEC') or die;

jimport('joomla.application.component.controller');

/**
 * Fabrik master display controller.
 *
 * @package		Joomla.Administrator
 * @subpackage	Fabrik
 * @since		3.0
 */

class FabrikController extends JController
{
	/**
	 * Display the view
	 *
	 * @param   boolean  $cachable   If true, the view output will be cached
	 * @param   array    $urlparams  An array of safe url parameters and their variable types, for valid values see {@link JFilterInput::clean()}.
	 *
	 * @return  void
	 */

	public function display($cachable = false, $urlparams = false)
	{
		$this->default_view = 'home';
		require_once JPATH_COMPONENT . '/helpers/fabrik.php';
		parent::display();

		// Load the submenu.
		FabrikHelper::addSubmenu(JRequest::getWord('view', 'lists'));
	}

	/**
	 * Method to load and return a model object.
	 *
	 * @param   string  $name    The name of the model.
	 * @param   string  $prefix  Optional model prefix.
	 * @param   array   $config  Configuration array for the model. Optional.
	 *
	 * @return	mixed	Model object on success; otherwise null failure.
	 */

	protected function createModel($name, $prefix = '', $config = array())
	{
		/*
		 * Use true so that we always use the Joomla db when in admin.
		 * otherwise if alt cnn set to default that is loaded and the fabrik tables are not found
		 */
		$db = FabrikWorker::getDbo(true);
		$config['dbo'] = $db;
		$r = parent::createModel($name, $prefix, $config);
		return $r;
	}
}
