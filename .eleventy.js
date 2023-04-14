const eleventySass = require('@11tyrocks/eleventy-plugin-sass-lightningcss');
const esbuild = require('esbuild');

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(eleventySass);

  // Pass through files/folders
  eleventyConfig.addPassthroughCopy('./src/assets');

  // Watched targets (folders/files) at 11ty serve
  eleventyConfig.addWatchTarget('./src/js/');

  // Bundle and build JS file at 11ty build
  eleventyConfig.on('eleventy.before', async () => {
    await esbuild.build({
      // esbuild config - check doc for more info
      entryPoints: ['./src/js/app.js'], // Array of all the entry points - update if needed
      bundle: true,
      outfile: 'public/js/app.min.js', // file output - update if needed
      sourcemap: true,
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    });
  });

  return {
    dir: {
      input: 'src',
      output: 'public',
    },
  };
};
