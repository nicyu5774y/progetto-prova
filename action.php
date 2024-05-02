<?php

//action.php

if(isset($_POST["action"]))
{
	$file = 'data.json';

	if($_POST['action'] == 'Add' ||$_POST['action'] == 'Edit')
	{
		$error = array();

		$data = array();

		$data['id'] = time();

		if(empty($_POST['first_name']))
		{
			$error['first_name_error'] = 'First Name is Required';
		}
		else
		{
			$data['first_name'] = trim($_POST['first_name']);
		}

		if(empty($_POST['last_name']))
		{
			$error['last_name_error'] = 'Last Name is Required';
		}
		else
		{
			$data['last_name'] = trim($_POST['last_name']);
		}

		$data['gender'] = trim($_POST['gender']);

		if(empty($_POST['age']))
		{
			$error['age_error'] = 'Age is required';
		}
		else
		{
			$data['age'] = trim($_POST['age']);
		}

		if(count($error) > 0)
		{
			$output = array(
				'error'		=>	$error
			);
		}
		else
		{
			$file_data = json_decode(file_get_contents($file), true);

			if($_POST['action'] == 'Add')
			{

				$file_data[] = $data;

				file_put_contents($file, json_encode($file_data));

				$output = array(
					'success' => 'Data Added'
				);
			}

			if($_POST['action'] == 'Edit')
			{
				$key = array_search($_POST['id'], array_column($file_data, 'id'));

				$file_data[$key]['first_name'] = $data['first_name'];

				$file_data[$key]['last_name'] = $data['last_name'];

				$file_data[$key]['age'] = $data['age'];

				$file_data[$key]['gender'] = $data['gender'];

				file_put_contents($file, json_encode($file_data));

				$output = array(
					'success' => 'Data Edited'
				);
			}
		}

		echo json_encode($output);
	}

	if($_POST['action'] == 'fetch_single')
	{
		$file_data = json_decode(file_get_contents($file), true);

		$key = array_search($_POST["id"], array_column($file_data, 'id'));

		echo json_encode($file_data[$key]);
	}

	if($_POST['action'] == 'delete')
	{
		$file_data = json_decode(file_get_contents($file), true);

		$key = array_search($_POST['id'], array_column($file_data, 'id'));

		unset($file_data[$key]);

		file_put_contents($file, json_encode($file_data));

		echo json_encode(['success' => 'Data Deleted']);

	}
}

?>