		var broken=false;
		var pause_Simulation = "<Atomiton.TqlInterface.PauseSim/>";
		var reset_Simulation = "<Atomiton.TqlInterface.ResetSim><Start>false</Start></Atomiton.TqlInterface.ResetSim>";
		var start_Simulation = "<Atomiton.TqlInterface.ResetSim><Start>true</Start></Atomiton.TqlInterface.ResetSim>";
		var resume_Simulation = "<Atomiton.TqlInterface.ResumeSim/>";
		var find_All_Residents = "<find format='all'><Resident><Id ne=''/></Resident></find>";
		var One_Day = 1440;
		
		var TRASH_BIN_ROUTE_1 = ["Bin[0]", "Bin[1]", "Bin[2]", "Bin[3]", "Bin[4]", "Bin[5]", "Bin[6]", "Bin[7]"];
		
		var TRASH_BIN_ROUTE_2 = ["Bin[8]", "Bin[9]", "Bin[10]", "Bin[11]", "Bin[12]", "Bin[13]", "Bin[14]",
		"Bin[15]"];
		
		var  TRASH_BIN_ROUTE_3 = ["Bin[16]", "Bin[17]", "Bin[18]", "Bin[19]", "Bin[20]", "Bin[21]",
		"Bin[22]", "Bin[23]", "Bin[24]"];
		
		var  INFLUENCERS = ["Resident[0]", "Resident[2]", "Resident[4]", "Resident[6]", "Resident[10]", "Resident[12]",
		"Resident[14]","Resident[16]","Resident[24]","Resident[30]", "Resident[36]","Resident[20]", "Resident[22]", "Resident[25]", "Resident[30]"];
		
		function callQuery(params, call) {
		
			var http = new XMLHttpRequest();
			var url = "http://54.175.145.156:8080/fid-TqlInterface";
			http.open("POST", url, true);
			http.setRequestHeader("Content-Type", "text/xml");
			//Send the proper header information along with the request
			
			//http.setRequestHeader("Content-length", params.length);
			//http.setRequestHeader("Connection", "close");

			http.onreadystatechange = function() {//Call a function when the state changes.
				if(http.readyState == 4 && http.status == 200) {
					//alert(http.responseText);
					var div = document.getElementById("dd");
					div.innerHTML="";
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(http.responseText,"text/xml");
					var jsonDoc = JSON.parse(xml2json(xmlDoc,""));
					var resident_arr = _.pluck(jsonDoc.Find.Result,"Resident");
					
					
					 for(k=0 ; k < resident_arr.length ;k++ )
					 {
						var ResidentId =  resident_arr[k].Id;
						var lastSite =  resident_arr[k].LastSite["@Value"];
						var photosTaken =  resident_arr[k].PhotosTaken["@Value"];
						var isInfluencer =  resident_arr[k].IsInfluencer["@Value"];
						var smartPhoneID =  resident_arr[k].SmartphoneId["@Value"];
								
						var table = document.getElementById("myTable");
						var row = table.insertRow(-1);
						
						var cell1 = row.insertCell(-1);
						cell1.innerHTML = ResidentId;
						
						var cell2 = row.insertCell(1);
						cell2.innerHTML = lastSite;
						
						var cell3 = row.insertCell(2);
						cell3.innerHTML = photosTaken;
						
						var cell4 = row.insertCell(3);
							
						
						if(isInfluencer == 'true')
						{
							isInfluencer = "Yes";
							cell4.setAttribute("style", "	color: green;");
						}
						
						if(isInfluencer == 'false')
						{
							isInfluencer = "No";
							cell4.setAttribute("style", "	color: red;");
						}
						cell4.innerHTML = isInfluencer;
						
						var cell5 = row.insertCell(4);
						cell5.innerHTML = smartPhoneID;
						
						/*var cell6 = row.insertCell(5);
						cell6.innerHTML = "<Button onclick='sendMsg()'>send msg</Button>";
						*/
						
					 }	
				}
			}
			http.send(params);
		
		}
		
		
		
		document.getElementById("clock").onload = function() {
		WebSocketTest()
				
		};

		
	
		function findResidentByID(id) {
		
			callQuery("<find format='all'><Resident><Id eq='"+id+"'/></Resident></find>","getCurrent");
		}
		
		function WebSocketTest()
         {
            if ("WebSocket" in window)
            {
               
               
               // Let us open a web socket
               var ws = new WebSocket("ws://54.175.145.156:8080/fid-Topic");
				
               ws.onopen = function()
               {
                  // Web Socket is connected, send data using send()
                  ws.send("Message to send");
				 
               };
				
               ws.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(received_msg,"text/xml");
					var jsonDoc = JSON.parse(xml2json(xmlDoc,""));
					var tick = _.pluck(jsonDoc,"Tick");
					document.getElementById("clock").innerHTML = tick;
					var value = tick % One_Day;
					 
					//alert("smartphoneID" +smartphoneID);
					
						
					  if(value == 360)
					  {		
							 pause();
						    setWorkerRoot();
							startCampain(true);
							setInfluencer(true);
					  }
				  
					if(value == 1080)
					
					{
						startCampain(false);
						setInfluencer(false);
						
					}
					
					var smartphoneID = jsonDoc.Publish.Result.SmartphoneId;
						
					
				
               };
				
               ws.onclose = function()
               { 
                  // websocket is closed.
                  alert("Connection is closed..."); 
               };
            }
            
            else
            {
               // The browser doesn't support WebSocket
               alert("WebSocket NOT supported by your Browser!");
            }
         }	
		 
		 //***************************************************************
		 
		 
		 function postQuery(param) {
			
		var http = new XMLHttpRequest();
		var url = "http://54.175.145.156:8080/fid-TqlInterface";
		//var params = "<Atomiton.TqlInterface.InstrumentTrashBin><BinId>Bin[14]</BinId><SensorType>IBeacon</SensorType></Atomiton.TqlInterface.InstrumentTrashBin>";
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", param.length);
		http.setRequestHeader("Connection", "close");

		http.onreadystatechange = function() {//Call a function when the state changes.
			if(http.readyState == 4 && http.status == 200) {
				//alert(http.responseText);
			}
		}
		http.send(param);

		}
		
			function start() {
			postQuery(start_Simulation);
		}
		
			function reset() {
			postQuery(reset_Simulation);
		}
		
			function pause() {
			postQuery(pause_Simulation);
		}
		
			function resume() {
			postQuery(resume_Simulation);
		}
		
		function findAllResident() {
		
			callQuery(find_All_Residents,"all");
		}
		
		function setWorkerRoot(){
			
			for (var i=0 ;i < TRASH_BIN_ROUTE_1.length ;i++)
			{
				
				postQuery("<SetWorkerRoute><Id>Worker[0]</Id><Site>"+TRASH_BIN_ROUTE_1[i]+"</Site></SetWorkerRoute>");
				
			}
			for (var i=0 ;i < TRASH_BIN_ROUTE_2.length ;i++)
			{
				
				postQuery("<SetWorkerRoute><Id>Worker[1]</Id><Site>"+TRASH_BIN_ROUTE_2[i]+"</Site></SetWorkerRoute>");
				
			}
			for (var i=0 ;i < TRASH_BIN_ROUTE_3.length ;i++)
			{
				
				postQuery("<SetWorkerRoute><Id>Worker[2]</Id><Site>"+TRASH_BIN_ROUTE_3[i]+"</Site></SetWorkerRoute>");
				
			}
			
		}
		
		function startCampain(isActive){
			
			postQuery("<Atomiton.TqlInterface.SetCampaignStatus><IsActive>"+isActive+"</IsActive></Atomiton.TqlInterface.SetCampaignStatus>");
			
		}
		
		
		function setInfluencer(isInfluencer)
		{
			
			for (var i=0 ;i < INFLUENCERS.length ;i++)
			{
				
				postQuery("<Atomiton.TqlInterface.SetInfluencer><Id>"+INFLUENCERS[i]+"</Id><State>"+isInfluencer+"</State></Atomiton.TqlInterface.SetInfluencer>");
				resume();
			}
			
		}