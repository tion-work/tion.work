package logging

import (
	"os"

	"github.com/sirupsen/logrus"
)

var Logger *logrus.Logger

func InitLogging() {
	Logger = logrus.New()

	// Set log level
	Logger.SetLevel(logrus.InfoLevel)

	// Set formatter
	Logger.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
	})

	// Set output
	Logger.SetOutput(os.Stdout)
}

func Infof(format string, args ...interface{}) {
	Logger.Infof(format, args...)
}

func Errorf(format string, args ...interface{}) {
	Logger.Errorf(format, args...)
}

func Debugf(format string, args ...interface{}) {
	Logger.Debugf(format, args...)
}

func Warnf(format string, args ...interface{}) {
	Logger.Warnf(format, args...)
}

func Info(args ...interface{}) {
	Logger.Info(args...)
}

func Error(args ...interface{}) {
	Logger.Error(args...)
}

func Debug(args ...interface{}) {
	Logger.Debug(args...)
}

func Warn(args ...interface{}) {
	Logger.Warn(args...)
}
