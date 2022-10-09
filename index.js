window.addEventListener('DOMContentLoaded', () => {
  listenButtonClick();
  populateExample();
});

const backendAPI = 'https://ayaka-apps.shn.hk/graphviz';

const populateExample = () => {
  const dot = `digraph G {
  graph [fontname = "Handlee"];
  node [fontname = "Handlee"];
  edge [fontname = "Handlee"];

  bgcolor=transparent;

  subgraph cluster_0 {
    node [style=filled];
    color=red;
    node [style=filled,color=pink];
    a0 -> a1 -> a2 -> a3;
    label = "*process #1*";
    fontsize = 20;
  }

  subgraph cluster_1 {
    node [style=filled];
    b0 -> b1 -> b2 -> b3;
    label = "*process #2*";
    fontsize = 20;
    color=blue
  }
  start -> a0;
  start -> b0;
  a1 -> b3;
  b2 -> a3;
  a3 -> a0;
  a3 -> end;
  b3 -> end;

  start [shape=Mdiamond];
  end [shape=Msquare];
}`;
  const textarea = document.querySelector('#graphvizCode');
  textarea.value = dot;
};

const listenButtonClick = () => {
  const visualiseBtn = document.querySelector('#visualise');
  const formatBtns = document.querySelectorAll('.format-button');
  const graphvizCode = document.querySelector('#graphvizCode');

  formatBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('.active').classList.remove('active');
      btn.classList.add(['active']);
    });
  });
  visualiseBtn.addEventListener('click', (e) => {
    const src = encodeURIComponent(graphvizCode.value);
    const format = encodeURIComponent(
      document.querySelector('.active').dataset.format
    );
    visualise(src, format);
  });
};

const visualise = async (src, format) => {
  const visualiser = document.querySelector('#visualiser');
  visualiser.innerHTML = '';

  if (src === '' || format === '') {
    showErrorMessage();
    return;
  }

  const url = `${backendAPI}/?src=${src}&format=${format}`;

  const viz = new Image();
  viz.src = url;

  viz.onerror = () => {
    showErrorMessage();
  };

  viz.onload = () => {
    const vizWrapper = document.createElement('div');
    vizWrapper.appendChild(viz);
    visualiser.appendChild(vizWrapper);

    const urlTextArea = document.createElement('textarea');
    urlTextArea.rows = 1;
    urlTextArea.wrap = 'off';
    urlTextArea.value = url;

    const copyBtn = document.createElement('div');
    copyBtn.classList.add('button');
    copyBtn.innerText = 'Copy image URL';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(url);
      copyBtn.innerText = 'Copied!';
      setTimeout(() => {
        copyBtn.innerText = 'Copy image URL';
      }, 5000);
    });

    visualiser.append(urlTextArea);
    visualiser.appendChild(copyBtn);

    window.setTimeout(() => {
      visualiser.scrollIntoView({
        block: 'start',
        inline: 'start',
        behavior: 'smooth',
      });
    }, 200);
  };
};

const showErrorMessage = () => {
  const errorMessage = document.querySelector('.error-message');
  errorMessage.classList.add(['show']);

  window.setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 2000);
};

const getViz = async (url) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const imageObjectURL = URL.createObjectURL(blob);
    return imageObjectURL;
  } catch (error) {
    console.log(error);
    return '';
  }
};
