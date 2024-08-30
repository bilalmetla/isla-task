module.exports = {
    apps: [
      {
        name: 'patient-info-api', // Name of your application
        script: 'frameworks/express/server.js', // Path to the entry point of your application
        instances: '2', // Scales the app to the maximum number of available CPUs
        exec_mode: 'cluster', // Enables cluster mode for load balancing
        env: {
          NODE_ENV: 'staging-dev',
          PORT: 3000
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 8080
        },
        watch: false, // Disable watching files in production
        max_memory_restart: '1G', // Restart the app if it exceeds 1GB of memory usage
        log_date_format: 'YYYY-MM-DD HH:mm Z', // Format for log timestamps
        error_file: './logs/err.log', // Path to error log file
        out_file: './logs/out.log', // Path to output log file
        merge_logs: true, // Merge logs from different instances
      }
    ]
  };