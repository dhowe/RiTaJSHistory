
#/usr/bin/perl -w

#### TO-RUN: ./run-phantom-tests.pl 2> err.txt

#### TODO: do checkout/update, run, mail, on cron

use strict;

#### OPTIONS

my $VERBOSE = 1;
my $ANT = `which ant`;  # "  /opt/local/bin/ant";
print $ANT;
my $BUILD_XML = "build-all-tests.xml";

#### VARIABLES

my $name = 0;
my $total = 0;
my $passed = 0;
my $percent = 0;
my %results = ();
my $result;
my $loaded;

my $src = "lib";
$src = $ARGV[0] if (scalar(@ARGV)>0);

##### run the ant task         ############################

print "\nRunning tests in PhantomJS...\n\n" if ($VERBOSE);

my @output = split(/\n/,`$ANT -Dsrc.loc=$src -f $BUILD_XML 2>&1`); 

##### compile results          ############################

foreach my $line (@output) {

    #if ($line =~ /\[apply\] Starting (.*)$/) {
    #    print trim("[INFO] $1")."\n"; 
    #}

    if ($line =~ /\[apply\] Starting ([^\.]*)\.html(.*)$/) {
        print "[INFO] $1 [loaded from $loaded]...\n"; 
        $name = $1;
        $name =~ s/Structure//;
        $name =~ s/-tests//;
    }
    elsif ($line =~ /\[apply\] \[TEST\] Loading RiTa from (.*)$/)  {
      $loaded = $1;
    } 
    elsif ($line =~ /\[apply\] ([0-9]+) tests of ([0-9]+) passed, [0-9]+ failed\./) {
        $passed += $1;
        $total += $2;
        $results{$name} = "$1/$2";
    }
}

die "FATAL: Total = 0\n" if ($total == 0); 

# format and print results ############################
print "\n";
while ( my ($key, $value) = each(%results) ) {

    $name = "[$key]";
    my @vals = split(/\//, $value);
    my $percent = "0%";
    $percent = sprintf("%.0f", int(100*($vals[0] / $vals[1]))).'%' if ($vals[1]);
    my $result =  "$vals[0] of $vals[1] passed, ".($vals[1]-$vals[0])." failed\n";
    printf("%-22s %-7s %s", $name, $percent, $result); 
}


$name = "[Total]";
$percent = sprintf("%.0f", int(100*($passed / $total))).'%';
$result = "$passed of $total passed, ".($total-$passed)." failed\n";
printf("\n%-22s %-7s %s\n\n\n", $name, $percent, $result); 
#print $total . "\n";


# output all the data     ############################

if ($VERBOSE) {
    foreach my $line (@output) {
        print STDERR "$line\n";
    }
}

sub trim($)
{
    my $string = shift;
    $string =~ s/^\s+//;
    $string =~ s/\s+$//;
    return $string;
}

