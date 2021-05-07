import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Icon ,Label} from 'semantic-ui-react';
export default class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }
    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        var link = 'https://talentservicestalentya.azurewebsites.net/listing/listing/closeJob';
            $.ajax({
                url: link,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(id),
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                async: false,
                success: (res) => {
                   window.location = "/ManageJobs";
                   console.log(res.data)
                  },
                error: (e) => console.log(e)

            })
         
    }
    render() {
        var j = this.props.job;
        return (
           <Popup content='Close this job!' trigger={<Icon name="close" onClick={() => this.selectJob(j.id)}/>}  />
  
        );
    }
}
