import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { Popup, Label } from 'semantic-ui-react';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import JobSummaryCard from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Button, Segment, Card, Table } from 'semantic-ui-react';
export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");

        this.state = {
            loadJobs: [],
            selectedJobs: [],
            loaderData: loader,
            //  activePage: 1,
            begin: 0,
            end: 3,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },

            //  totalPages: 1,
            //  activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.setselectedJobs = this.setselectedJobs.bind(this);
        this.init = this.init.bind(this);
        this.hanldePagination = this.hanldePagination.bind(this)
    }
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        this.loadData()
        loaderData.isLoading = false
        this.setState({ loaderData });
    }
    componentDidMount() {
        this.init()
    }
    loadData() {
        var link = 'https://talentservicestalentya.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            async: false,
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showUnexpired: this.state.filter.showUnexpired
            },
            success: (res) => {
                this.setState({
                    loadJobs: [...this.state.loadJobs, ...res.myJobs],
                }, () => this.setselectedJobs(this.state.loadJobs))
            },
            error: (e) => {
                console.log(e.status)
            }
        })

    }
    setselectedJobs(jobsData) {
        this.setState({
            selectedJobs: jobsData.slice(this.state.begin, this.state.end)
        })
    }

    hanldePagination(e, data) {
        console.log(data.activePage)
        this.setState({
            activePage: data.activePage
        }, () => {
            this.setState({
                begin: this.state.activePage * 3 - 3,
                end: this.state.activePage * 3
            },

                () => this.setselectedJobs(this.state.loadJobs))
        })
    }

    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <div>{this.state.loadJobs.length > 0
                        ?
                        <Table className="ui very basic table">
                            <Table.Row>
                                {
                                    this.state.selectedJobs.map(job => {
                                        return (
                                            <Table.Cell>
                                                <Card>
                                                    <Card.Content style={{ height: 300, maxWidth: 400 }}>
                                                        {<h3>{job.title}</h3>}
                                                        <p>{`${job.location.city}, ${job.location.country}`}</p>
                                                        <p>{job.summary}</p>
                                                    </Card.Content>
                                                    <Card.Content extra>
                                                        <div>
                                                            <Button size={'tiny'} style={{
                                                                display: new Date().toISOString() < job.expiryDate ? "none" : "block",
                                                                backgroundColor: "red",
                                                                float: "left",

                                                            }}>Expired
                                            </Button>
                                                            <Button.Group size={'tiny'} style={{ float: "right" }}>
                                                                <Button basic color='blue'>
                                                                    <JobSummaryCard job={job} loadData={this.loadData} />
                                                                </Button>
                                                                <Button basic color='blue' href={`./EditJob/${job.id}`}>      
                                                                    <Popup content='Edit this job!' trigger={<Icon name="edit"/>} />
                                                                </Button>
                                                                <Button basic color='blue'><Icon name="copy" /></Button>
                                                            </Button.Group>

                                                        </div>
                                                    </Card.Content>

                                                </Card>
                                            </Table.Cell>
                                        )
                                    })
                                }
                            </Table.Row>
                        </Table>
                        : <p></p>}</div>

                    <Pagination
                        defaultActivePage={1}
                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                        totalPages={Math.ceil(this.state.loadJobs.length / 3)}
                        onPageChange={this.hanldePagination}
                    />

                </div>
            </BodyWrapper>
        )
    }
}