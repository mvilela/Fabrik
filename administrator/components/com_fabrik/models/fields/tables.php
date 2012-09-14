<?php
/**
 * Renders a list of tables, either fabrik lists, or db tables
 *
 * @package     Joomla
 * @subpackage  Form
 * @copyright   Copyright (C) 2005 Rob Clayburn. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

require_once JPATH_ADMINISTRATOR . '/components/com_fabrik/helpers/element.php';

/**
 * Renders a list of tables, either fabrik lists, or db tables
 *
 * @package     Joomla
 * @subpackage  Form
 * @since       1.6
 */

jimport('joomla.html.html');
jimport('joomla.form.formfield');
jimport('joomla.form.helper');
JFormHelper::loadFieldClass('list');

class JFormFieldTables extends JFormFieldList
{
	/**
	 * Element name
	 *
	 * @access	protected
	 * @var		string
	 */
	var $_name = 'Tables';

	/**
	 * Get list options
	 *
	 * @return  array
	 */

	protected function getOptions()
	{
		$connectionDd = $this->element['observe'];
		$options = array();
		$db = FabrikWorker::getDbo(true);
		if ($connectionDd == '')
		{
			//we are not monitoring a connection drop down so load in all tables
			$query = "SHOW TABLES";

			$db->setQuery($query);
			$items = $db->loadResultArray();
			// Check for a database error.
			if ($db->getErrorNum())
			{
				JError::raiseWarning(500, $db->getErrorMsg());
			}
			foreach ($items as $l)
			{
				$options[] = JHTML::_('select.option', $l, $l);
			}
		}
		else
		{
			$connId = $this->form->getValue('connection_id');
			$query = $db->getQuery(true);
			$query->select('id AS value, db_table_name AS ' . $db->quote('text'))->from('#__{package}_lists')
				->where('connection_id = ' . (int) $connId);
			$db->setQuery($query);
			$items = $db->loadObjectList();
			foreach ($items as $item)
			{
				$options[] = JHTML::_('select.option', $item->value, $item->text);
			}
		}
		return $options;
	}

	/**
	 * Get input
	 *
	 * @return  string  HTML input
	 */

	protected function getInput()
	{
		$connectionDd = $this->element['observe'];
		if ((int) $this->form->getValue('id') != 0 && $this->element['readonlyonedit'])
		{
			return '<input type="text" value="' . $this->value . '" class="readonly" name="' . $this->name . '" readonly="true" />';
		}
		$c = ElementHelper::getRepeatCounter($this);
		$readOnlyOnEdit = $this->element['readonlyonedit'];
		if ($connectionDd != '')
		{
			$connectionDd = ($c === false) ? $connectionDd : $connectionDd . '-' . $c;
			$opts = new stdClass;
			$opts->livesite = COM_FABRIK_LIVESITE;
			$opts->conn = 'jform_' . $connectionDd;
			$opts->value = $this->value;
			$opts = json_encode($opts);
			$script = "FabrikAdmin.model.fields.fabriktable['$this->id'] = new tablesElement('$this->id', $opts);\n";
			FabrikHelperHTML::script('administrator/components/com_fabrik/models/fields/tables.js', $script);
		}
		$html = parent::getInput();
		$html .= "<img style='margin-left:10px;display:none' id='" . $this->id . "_loader' src='components/com_fabrik/images/ajax-loader.gif' alt='"
			. JText::_('LOADING') . "' />";
		return $html;
	}

}
