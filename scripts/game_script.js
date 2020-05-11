
/*--Constants--*/

//the initial state for the store and the default answers if there was no user input
const initState = { who:  "someone", 
                    what: "doing someting", 
                    when: "at some time", 
                    where: "somewhere",
                    show: false, 
                  };

//constants for action types
const SHOW_RESULT = "SHOW_RESULT";
const HIDE_RESULT = "HIDE_RESULT";

// variable for the container for the game components
const gameContainer = document.getElementById("center");

//-------------------------------------------------------------------------

/*--Redux--*/

//actions
function showResult(newState) { 
  return { type: SHOW_RESULT, newState };
}
function hideResult() { 
  return { type: HIDE_RESULT };
}
//reducer
function mainReducer(state = initState, action) {
  switch(action.type) {
    case SHOW_RESULT: 
    {
      return immer.produce(state, draft => {

        //handle empty inputs by changing them into default values
        if (action.newState.who =="") {draft.who = initState.who}
        else { draft.who = action.newState.who; }
        if (action.newState.what =="") {draft.what = initState.what}
        else { draft.what = action.newState.what; }
        if (action.newState.when =="") {draft.when = initState.when}
        else { draft.when = action.newState.when; }   
        if (action.newState.where =="") {draft.where = initState.where}
        else { draft.where = action.newState.where; }

        //show result
        draft.show = true;
      });
    }
    case HIDE_RESULT: 
    {
      return immer.produce(state, draft => {

        //restore default values
        draft.who = initState.who;
        draft.what = initState.what;
        draft.when = initState.when;
        draft.where = initState.where;

        //hide result
        draft.show = false;
      });
    }
    default:
      return state;
  }
}

//store
const store = Redux.createStore(mainReducer);

//-------------------------------------------------------------------------

/*--React--*/

class GameApp extends React.Component { //handles form with questions 

  render() {
    var visState = "m--hide"
    if (this.props.show) {
      visState = "m--show"
    }

    return (
      <div className="game_box">
        <div className="game_box__questions">
          {/* The questions are asked all at once */}
          <form id="questions" onSubmit={this.makeSentence}>
            <input className="game_box__input" type="text" placeholder="Who?" maxlength="32"></input>
            <input className="game_box__input" type="text" placeholder="What?" maxlength="32"></input>
            <input className="game_box__input" type="text" placeholder="When?" maxlength="32"></input>
            <input className="game_box__input" type="text" placeholder="Where?" maxlength="32"></input>
            <input className="game_box__submit" type="submit" value="Make a sentence!"/>
            <div className="clearInputs" onClick={this.inputRefresh}>Clear</div>
          </form>
        </div>
        <div className={"game_box__sentence " + visState}> 
          <GameApp__Sentence parts={this.props}/>
        </div>
      </div>
    );
  }
  
  makeSentence(e) {  //shows resulting sentence based on user input
    e.preventDefault();

    var form = document.getElementById("questions");

    var newState = {  who:  form.elements[0].value, 
                      what: form.elements[1].value, 
                      when: form.elements[2].value, 
                      where: form.elements[3].value };

    store.dispatch(showResult(newState));
  }

  inputRefresh() { //clears inputs and resets sentence
    
    store.dispatch(hideResult());

    var form = document.getElementById("questions");
    var i;
    for (i = 0; i < form.elements.length-1; i++) {
      form.elements[i].value = "";
    } 
  }

}

const GameApp__Sentence = (props) => { //handles display of the resulting sentence
  return (
    <div className="game_box__sentence__inner">
      &apos;{props.parts.who} {props.parts.what} {props.parts.where} {props.parts.when}&apos;
    </div>
  );
}

function mapStateToProps(state) {
  return state;
}
const ConnectedGameApp = ReactRedux.connect(mapStateToProps)(GameApp);

class GameAppWrapper extends React.Component {
  render(){
     return (
      <window.ReactRedux.Provider store={store}>
        <ConnectedGameApp />
      </window.ReactRedux.Provider>
     );
  }
}

ReactDOM.render(< GameAppWrapper />, gameContainer);
