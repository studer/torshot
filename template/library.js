var Grid = window.ReactBootstrap.Grid;
var Row = window.ReactBootstrap.Row;
var Col = window.ReactBootstrap.Col;
var Thumbnail = window.ReactBootstrap.Thumbnail;
var Button = window.ReactBootstrap.Button;
var Input = window.ReactBootstrap.Input;

var Links = React.createClass({
  render: function() {
    var createItem = function(item) {
      return (
        <Col md={8} >
          <Thumbnail src={'data:image/jpeg;charset=utf-8;base64,' + item}>
          </Thumbnail>
        </Col>
      );
    };
    return <Row>{createItem(this.props.base64)}</Row>;
  },
});

var Library = React.createClass({
  getInitialState: function() {
    return {base64: '',
            url: ''};
  },
  onChange: function(e) {
    this.setState({
      url: e.target.value
    });
  },
  onClick: function(e) {
    e.preventDefault();
    this.serverRequest = $.get('/torshot/'+this.state.url, function (result) {
      var res = result[0].status;
      if (res == 'OK') {
        this.setState({
          base64: result[0].base64
        }); }
      else {
        alert(res);
      }
    }.bind(this));
  },
  render: function() {
    return (
        <Grid>
          <Row><Col md={4}><h1>Torshot</h1></Col></Row>
          <Row><Col md={4}>
          <Input
          type="text"
          placeholder="Enter URL"
          label="Take a screenshot of the URL"
          help="Take a screenshot of the URL"
          hasFeedback
          ref="input"
          groupClassName="group-class"
          labelClassName="label-class"
          onChange={this.onChange} />
          </Col>
          <Col md={4}><Button bsStyle="primary" onClick={this.onClick.bind(this)} href='#'>Take Screenshot !</Button></Col>
          </Row>
          <Links base64={this.state.base64}/>
        </Grid>
    );
  }
});

ReactDOM.render(<Library />, document.getElementById('container'));
