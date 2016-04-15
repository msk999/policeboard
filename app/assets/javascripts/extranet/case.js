$('#extranet-case-detail').ready(function () {
	
	$(document).on('click', '.remove_fields', function() {
		//console.log('Remove link called ' + $(this).attr('class'));
		$(this).prev('input[type=hidden]').val("true");
		$(this).closest('.fields').hide();
		return false;
	});
	
	$(document).on('click', '.add_fields', function(){
		var association = $(this).data('association');
		var new_id = new Date().getTime();  
	    var regexp = new RegExp("new_" + association, "g");  
		$(this).before($(this).data('fields').replace(regexp, new_id));
		
		//if this is adding a new case rule, there's more work to be done to the fields
		var isCaseRule = $(this).parent('.case_rule_fields');
	    if (isCaseRule){
	    	initCaseRuleForm(new_id);
	    }
	    
	    //if this is adding a new board
		var isBoardMemberVote = $(this).parent('.board-member-vote');
	    if (isBoardMemberVote){
	    	initBoardMemberVoteForm(new_id);
	    }
	    		
		return false;
	});
	
	
	//case rules
	var initCaseRuleForm = function(new_id)
	{
		//console.log("initialize new case rule form for id " + new_id);
		//case_case_rules_attributes_1460665355571_rule_id
		var id = 'case_case_rules_attributes_' + new_id + '_rule_id';
		var $newItem = $('#case-rules input[id=' + id + ']').parent('.case-rule-fields');
		if ($newItem){
			$newItem.find('.rule_selection').show();
		}
		return false;
	};
	
	//event for selecting a case rule to add
	$('#case-rules').on('change', '.case-rule-fields select[name=rule_select]', function(){
		var $rule = $(this).find('option:selected');
		//console.log("rule_select changed to " + $rule.val() + "" + $rule.data('description'));
		
		//update the case rule code
		$rule.parent().closest('div.case-rule-fields').find('.rule_code').html($rule.val());
		//update the case rule description
		$rule.parent().closest('div.case-rule-fields').find('.rule_description').html($rule.data('description'));
		
		//update the case rule id hidden field
		$rule.parent().closest('div.case-rule-fields').find('input.rule_id').val($rule.val())
		
	});
	
	
	//board member voting
	//show dissent reason text box when dissent is selected;
	$(document).on('change', 'input[type="radio"][name$="[vote_id]"]', function(){
		toggleDissent($(this));
	});
	
	var toggleDissent = function($element){
		var $tbDissent = $($element.parent('.board-member-vote').find('.dissent-description'));
		if ($tbDissent)
		{
			var vote = $('label[for='+ $element.attr('id')+']').text();
			var showOrHide = vote === "Dissent";
			$tbDissent.closest('.dissent-detail').toggle(showOrHide);
		}
	};
	
	//hide all dissent description boxes
	$('.board-member-vote .dissent-description').each(function(index, value){
		//get the radio button for the vote
		var $rbVote = $(this).closest('div.board-member-vote').find('input[type="radio"][name$="[vote_id]"]:checked');
		if ($rbVote){
			toggleDissent($($rbVote));
		}
	});	
	
	//board member add
	$('#board-member-votes').on('change', '.board-member-vote-fields select[name=board_select]', function(){
		//this is the select element
		//board is the selected option
		var $selectedBoard = $(this).find('option:selected');
		var boardName = $selectedBoard.text();
		var boardId = $selectedBoard.val();
		
		//update the board name
		$selectedBoard.parent()
			.closest('div.board-member-vote-fields')
			.find('.board-name')
			.html(boardName);
		
		//updated the hidden board member id
		$selectedBoard.parent()
			.closest('div.board-member-vote-fields')
			.find('input[type=hidden][id^=case_board_member_votes]')
			.val(boardId);
		
	});
	
	var initBoardMemberVoteForm = function(new_id)
	{
		var id = 'case_board_member_votes_attributes_' + new_id + '_board_member_id';
		var $newItem = $('#board-member-votes input[id=' + id + ']').parent('.board-member-vote-fields');
		if ($newItem){
			$newItem.find('.board-selection').show();
		}
		return false;
	};
});