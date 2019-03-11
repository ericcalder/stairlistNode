///// populate cleaners /////
      $.get('edit/cleaners',function(cleaners){
        console.log('in cleaners')
        console.log('claener data='+cleaners[0].cleaner+'id='+cleaners[0].id)
        console.log('data.length='+cleaners.length)
        $('body').data({cleaners:cleaners}); // save pdata
      })
  refresh();
 /////////////////variables /////////////////////////
 var freq=['weekly', 'A_week', 'B_week', '_3weekly','_4weekly','Monthly'];
 var clist=$('body').data().cleaners;
 ////////////////////////////////////////////////
 ////////////////  new stair modal on load ///////////////////////////
 $('#add_').on('show.bs.modal', function () {
  console.log('loaded modal')
  var clist=$('body').data().cleaners
        console.log('cleaner list='+clist[0].cleaner)
        console.log('freq list='+freq)
        populateAddForm(freq, clist)
        submitAddForm(freq, clist)
  // do something…
})
 
 ///////////////////////////////////////
  function selectRow(data, freq){
    $('.csv .table tbody tr').on('click', function(){
        console.log('in click tr')
        console.log('row=='+$(this).index())
        var row=$(this).index()
        var clist=$('body').data().cleaners
        console.log('cleaner list='+clist[0].cleaner)
        console.log('vals=='+data[row].stair+'  '+
                    freq[data[row].freq]+'   '+
                    data[row].cleaner+' next_clean    '+data[row].next_clean+
                    ' sqlToDatepicker= '+sqlToDatepicker(data[row].next_clean))
/////////////////////////////////////////////////////////////
      populateForm(data, freq, row, clist);
      ///////////////////////////////////////////   
        $('#edit_').modal('show');//show form
        submitForm(freq, clist, row);

        $('#edit_ .modal-footer .delete_stair').on('click',function(){
          
          console.log('in delete_stair')
          //confirm('delete_stair??')
          if(confirm('delete_stair??')){
            $.get('edit/delete',{row:data[row]}, function(data){
              console.log('in edit/delete')
              console.log('data='+JSON.stringify(data))
            })//get
            console.log('deleted')
            $('#edit_').modal('hide');//hide form
            refresh()
            return
            }//if
          else {
            console.log('cancel'); 
            $('#edit_').modal('hide');//hide form
            return}
        })//click

      })//click for select row
        
  }//selectRow

  function submitForm(freq, clist, row){
    $('#target').submit(function(e){
          console.log('in submit')
          var arr=$( this ).serializeArray();
          console.log( $( this ).serializeArray() );
          
          $.post('edit/form_update',{arr: JSON.stringify(arr)},function(data){
            console.log('in edit/form_update')
            console.log('data=='+'  '+data.changedRows+' '+JSON.stringify(data))
            //console.log('arr values+++'+arr[0].value+'  '
              //+freq[arr[1].value]+'  '+clist[arr[3].value-1].cleaner+
              //'   '+mySqlToCsv(arr[2].value))

    //      $('.csv .table tbody tr:eq('+(arr[0].value-1)+') td:eq(1)')
      //              .empty()
        //            .append(freq[arr[1].value])
          })//post
          event.preventDefault();
          refresh()
          
          $('#edit_').modal('hide');//show form
          return
        })//submit
  }

function submitAddForm(freq, clist){
  $('#target_').submit(function(e){
          console.log('in submit add form')
          var arr=$( this ).serializeArray();
          console.log( $( this ).serializeArray() );
           $.post('edit/form_add',{arr: JSON.stringify(arr)},function(data){
            console.log('in edit/form_add')
            console.log('data=='+'  '+data.changedRows+' '+JSON.stringify(data))
           // console.log('arr values+++'+arr[0].value+'  '+arr[1].value+'  '
             // +freq[arr[2].value]+'  '+clist[arr[4].value-1].cleaner+
             // '   '+mySqlToCsv(arr[3].value))

    //      $('.csv .table tbody tr:eq('+(arr[0].value-1)+') td:eq(1)')
      //              .empty()
        //            .append(freq[arr[1].value])
          })//post
        });//submit
}


function refresh(){
  $.get('edit/load',function(data){
            console.log('in load refresh')
            console.log('data='+data[0].stair)
            console.log('data.length='+data.length)
            $('.csv .table tbody').empty()
            var freq=['weekly', 'A_week', 'B_week', '_3weekly','_4weekly','Monthly'];
            for(var i=0; i<data.length;i++){
                      $('.csv .table tbody').append(
                        '<tr><td>'+data[i].stair+
                        '</td><td>'+freq[data[i].freq]+
                        '</td><td>'+data[i].cleaner+'</td><td>'+
                        '</td><td>'+mySqlToCsv(data[i].next_clean)+'</td></tr>')
                        
                    }//for
  //          return
                   selectRow(data,freq)
  
            })//get refresh
}

  function populateForm(data, freq, row, clist){
    $('#edit_ .modal-body h3').empty()
        .append(data[row].stair+'    '+data[row].postcode)
        $('#edit_ .modal-body #target input:eq(0):text').val(data[row].id)
        $('#edit_ .modal-body #target input:eq(1)')
          .val(sqlToDatepicker(data[row].next_clean));//mySqlToCsv(data[row].next_clean))

        /////populate select frequency  //////////////////////////////
        $('#edit_ .modal-body #target select#freqselect').empty()
        for(k=0;k<freq.length;k++){
        $('#edit_ .modal-body #target select#freqselect')
            .append($('<option/>').val(k).text(freq[k]));
        }//for    
      /////////////////////////////////////////////////////
      ///// populate cleaners /////

      //var clist=$('body').data().cleaners

        $('#edit_ .modal-body #target select#cleanerselect').empty()
        for(k=0;k<clist.length;k++){
        $('#edit_ .modal-body #target select#cleanerselect')
            .append($('<option/>').val(clist[k].id).text(clist[k].cleaner));
        }//for
      ////////////////////////////
        $('#edit_ .modal-body #target select#freqselect').val(data[row].freq)
        .prop("selected",true)
        ///////////////////////////////
        $('#edit_ .modal-body #target select#cleanerselect').val(data[row].cleaner_id)
        .prop("selected",true)
        ///////////////////////////////
        $('#edit_ .modal-body #target select#freqselect').on('change',function(){
          console.log(' opt='+$('select[id=freqselect]').val())  
        })
        console.log('data[row].cleaner_id=='+data[row].cleaner_id)
        //$('#edit_ .modal-body #target select#cleanerselect option')
        //.val(1)
        //.prop("selected",true)
        $('#edit_ .modal-body #target select#cleanerselect').on('change',function(){
          console.log(' opt='+$('select[id=cleanerselect]').val())  
        })
        return
  }

function populateAddForm(freq, clist){
    
        /////populate select frequency  //////////////////////////////
        $('#add_ .modal-body #target_ select#freqselect').empty()
        for(k=0;k<freq.length;k++){
        $('#add_ .modal-body #target_ select#freqselect')
            .append($('<option/>').val(k).text(freq[k]));
        }//for    
      /////////////////////////////////////////////////////
      ///// populate cleaners /////
      //var clist=$('body').data().cleaners

        $('#add_ .modal-body #target_ select#cleanerselect').empty()
        for(k=0;k<clist.length;k++){
        $('#add_ .modal-body #target_ select#cleanerselect')
            .append($('<option/>').val(clist[k].id).text(clist[k].cleaner));
        }//for
        $('#add_ .modal-body #target_ select#freqselect').on('change',function(){
          console.log(' opt='+$('select[id=freqselect]').val())  
        })
        $('#add_ .modal-body #target_ select#cleanerselect').on('change',function(){
          console.log(' opt='+$('select[id=cleanerselect]').val())  
        })
        return
  }

  function mySqlToCsv(date){
    if(date){
  var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DD=date.slice(8,10);
  var MM=date.slice(5,7);
  var mm=parseInt(MM);
  mm=month[mm-1];
  var YYYY=date.slice(2,4);
  return DD+'-'+mm+'-'+YYYY;
}
else{ return ''}
}

function sqlToDatepicker(mysqldate){
  if(mysqldate){
    var date=mysqldate.slice(0,10)
    console.log('sqlToDatepicker='+date)
    return date
  }
}

