import useStyles from './styles';

function Spinner() {
  const classes = useStyles();
    return (
      <div className={classes.loadingSpinnerContainer}>
        <div className={classes.loadingSpinner}></div>
      </div>
    )
  }
  
  export default Spinner