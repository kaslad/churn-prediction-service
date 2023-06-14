import React from 'react';
import { Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { Paper } from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/system';
import {actions} from "./actions.js";

const theme = createTheme();

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '100px 0', // Adjust the padding as needed
  boxSizing: 'border-box',
  overflow: 'auto', // Enable vertical scrolling when content overflows
});


const StyledPaper = styled(Paper)({
  padding: theme.spacing(2),
});

const TrainPage = (props) => {


  return (
    <Container>
      <StyledPaper>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <fieldset className="fieldset">
              <legend className="legend">Данные для обучения</legend>
              <div className="input">
                <input type="file" id="data" />
              </div>
              <Button
                id="data_shown"
                variant="contained"
                color="secondary"
                onClick={() => {
                  document.getElementById('data').click();
                }}
              >
                UPLOAD
              </Button>
              <div className="description">
                <br />
                <Typography>Данные будут использоваться для обучения</Typography>
              </div>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">Название модели</legend>
    <div className="input">
      <TextField id="model_name" fullWidth defaultValue="Loyal-seg " />
    </div>
    <div className="description">
      <Typography className="type"></Typography>
      <Typography>
        Задайте название модели для дальнейшего удобства выбора при предсказании
      </Typography>
    </div>
  </fieldset>
</Grid>

          <Grid item xs={12} sm={6}>
            <fieldset className="fieldset">
              <legend className="legend">Алгоритм модели</legend>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="ball_id"
                        onClick={(e) => {
                          actions.toggle_training_mode(e.target.id, 'Classification');
                        }}
                      />
                    }
                    label="Классификация"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="ball_id2"
                        onClick={(e) => {
                          actions.toggle_training_mode(e.target.id, 'Regression');
                        }}
                      />
                    }
                    label="Регрессия"
                  />
                </Grid>
              </Grid>
              <div className="description">
                <Typography>Выбор алгоритма.</Typography>
              </div>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6}>
            <fieldset className="fieldset">
              <legend className="legend">Количество подходов к обучению</legend>
              <div className="input">
                <TextField id="generations" type="number" defaultValue="5" fullWidth />
              </div>
              <div className="description">
                <Typography className="type">Integer or None, default: 5</Typography>
                <Typography>Количество подходов к обучению. Это будет влиять на время обучения и качество модели</Typography>
              </div>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6}>
            <fieldset className="fieldset">
              <legend className="legend">population_size</legend>
              <div className="input">
                <TextField id="population_size" type="number" defaultValue="50" fullWidth />
              </div>
              <div className="description">
                <Typography className="type">Integer, default: 50</Typography>
                <Typography>The number of individuals to retain every generation.</Typography>
              </div>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6}>
            <fieldset className="fieldset">
              <legend className="legend">offspring_size</legend>
              <div className="input">
                <TextField id="offspring_size" type="number" defaultValue="50" fullWidth />
              </div>
              <div className="description">
                <Typography className="type">Integer or None, default: 50</Typography>
                <Typography>The number of offspring to produce each generation.</Typography>
              </div>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6}>
            <fieldset className="fieldset">
              <legend className="legend">mutation_rate</legend>
              <div className="input">
                <TextField id="mutation_rate" type="number" defaultValue="0.1" fullWidth />
              </div>
              <div className="description">
                <Typography className="type">Float or None, default: 0.1</Typography>
                <Typography>The rate of mutation for individuals.</Typography>
              </div>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6}>
            <fieldset className="fieldset">
              <legend className="legend">crossover_rate</legend>
              <div className="input">
                <TextField id="crossover_rate" type="number" defaultValue="0.5" fullWidth />
              </div>
              <div className="description">
                <Typography className="type">Float or None, default: 0.5</Typography>
                <Typography>The rate of crossover for individuals.</Typography>
              </div>
            </fieldset>
          </Grid>

          <Grid item xs={12} sm={6}>
            <fieldset className="fieldset">
              <legend className="legend">scoring</legend>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="scoring_id"
                        onClick={(e) => {
                          actions.toggle_scoring(e.target.id, 'accuracy');
                        }}
                      />
                    }
                    label="accuracy"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="scoring_id2"
                        onClick={(e) => {
                          actions.toggle_scoring(e.target.id, 'f1');
                        }}
                      />
                    }
                    label="f1"
                  />
                </Grid>
              </Grid>
              <div className="description">
                <Typography>The function used to evaluate the quality of a given solution.</Typography>
              </div>
            </fieldset>
          </Grid>
          <Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">cv</legend>
    <div className="input">
      <TextField id="cv" type="number" fullWidth defaultValue="5" />
    </div>
    <div className="description">
      <Typography className="type">Integer or None</Typography>
      <Typography>The number of folds to evaluate each pipeline.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">subsample</legend>
    <div className="input">
      <TextField id="subsample" type="number" fullWidth defaultValue="1.0" />
    </div>
    <div className="description">
      <Typography className="type">Float or None</Typography>
      <Typography>The fraction of training samples that are used during each generation.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">n_jobs</legend>
    <div className="input">
      <TextField id="n_jobs" type="number" fullWidth defaultValue="1"/>
    </div>
    <div className="description">
      <Typography className="type">Integer or None</Typography>
      <Typography>The number of CPU cores to use for parallelizing the pipeline generation.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">max_time_mins</legend>
    <div className="input">
      <TextField id="max_time_mins" type="number" fullWidth />
    </div>
    <div className="description">
      <Typography className="type">Float or None</Typography>
      <Typography>The number of minutes to allocate to the optimization process.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">max_eval_time_mins</legend>
    <div className="input">
      <TextField id="max_eval_time_mins" type="number" fullWidth defaultValue="5" />
    </div>
    <div className="description">
      <Typography className="type">Float or None</Typography>
      <Typography>The number of minutes to allocate to evaluating a single pipeline.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">random_state</legend>
    <div className="input">
      <TextField id="random_state" type="number" fullWidth />
    </div>
    <div className="description">
      <Typography className="type">Integer or None</Typography>
      <Typography>The seed of the pseudo-random number generator.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">config_dict</legend>
    <div className="input">
      <TextField id="config_dict" fullWidth defaultValue="TPOT light" />
    </div>
    <div className="description">
      <Typography className="type">Dict or None</Typography>
      <Typography>
        A configuration dictionary that will be passed directly to the TPOT estimator.
      </Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">template</legend>
    <div className="input">
      <TextField id="template" fullWidth />
    </div>
    <div className="description">
      <Typography className="type">String or None</Typography>
      <Typography>A string template to use to control the pipeline structure.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">early_stop</legend>
    <div className="input">
      <TextField id="early_stop" type="number" fullWidth />
    </div>
    <div className="description">
      <Typography className="type">Integer or None</Typography>
      <Typography>The number of generations without improvement to wait before stopping optimization.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">verbosity</legend>
    <div className="input">
      <TextField id="verbosity" type="number" fullWidth defaultValue={2} />
    </div>
    <div className="description">
      <Typography className="type">Integer, default: 2</Typography>
      <Typography>The logging verbosity level.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">use_dask</legend>
    <div className="input">
      <Checkbox id="use_dask" value="True" />
    </div>
    <div className="description">
      <Typography>Whether to use Dask for parallelism.</Typography>
    </div>
  </fieldset>
</Grid>

<Grid item xs={12} sm={6}>
  <fieldset className="fieldset">
    <legend className="legend">warm_start</legend>
    <div className="input">
      <Checkbox id="warm_start" />
    </div>
    <div className="description">
      <Typography>Whether to start the optimization from the previous state.</Typography>
    </div>
  </fieldset>
</Grid>
         <Grid item xs={12} sm={12}>
  <div className="ui_item" style={{ maxHeight: '200px', overflowY: 'auto' }}>
    <fieldset className="fieldset">
      <legend align="center" className="legend">
        RESPONSE
      </legend>
      <div className="text" id="response">
        Waiting for training to start...
      </div>
    </fieldset>
  </div>
</Grid>



          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={() => actions.trainTPOT()}>
              Обучить модель
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default TrainPage;